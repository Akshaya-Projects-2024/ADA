import React, { useMemo } from "react";
import Modal from "react-native-modal";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
  ScrollView,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

import ArrowLeft from "../assets/svg/arrowLeft.svg";
import { THEMES } from "../assets/theme/themes";
import { screenWidth } from "../utils/dimensions";
import Button from "./Button";

const PetSelectionDialog = ({ onPetSelect, onClose, flag, title }) => {
  const { height } = useWindowDimensions();
  const petDetails = useSelector(
    (state) => state?.commonReducer?.parentProfie?.petDetails
  );
  const [selectedPet, setSelectedPet] = React.useState();

  const getUrl = useMemo(
    () => (documents) => ({
      uri: documents?.find((x) => x.documenttype === "profilePhoto")?.url,
    }),
    []
  );

  const renderPetItem = ({ item, index }) => (
    <Pressable key={index} onPress={() => setSelectedPet(item.id)}>
      <Image
        source={getUrl(item.documents)}
        width={ms(112)}
        height={ms(112)}
        style={styles.petImage}
      />
      {selectedPet === item.id && (
        <View style={styles.selectedOverlay}>
          <Feather name="check-circle" color="#fff" size={ms(24)} />
        </View>
      )}
      <Text style={styles.petName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <Modal
      onBackdropPress={onClose}
      transparent={true}
      animationType="none"
      style={styles.modalContainer}
      visible={flag}
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable onPress={onClose} style={styles.crossIcon}>
          <ArrowLeft />
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <ScrollView style={{ height: height * 0.6 }}>
            {petDetails?.map((item, index) => renderPetItem({ item, index }))}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              onPetSelect(selectedPet)
              setSelectedPet()
            }}
            title="Select Pet"
            style={styles.button}
            disabled={!selectedPet}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDF5",
    padding: 0,
    margin: 0,
    flex: 1,
  },
  root: {
    zIndex: 5,
    width: screenWidth,
    marginHorizontal: 0,
    flex: 1,
  },
  crossIcon: {
    paddingHorizontal: ms(12),
    paddingTop: ms(12),
  },
  titleText: {
    fontSize: THEMES.fonts.font20,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: ms(40),
    width: "60%",
  },
  petImage: {
    borderRadius: ms(12),
    borderWidth: ms(1),
    borderColor: THEMES.colors.black,
    marginVertical: ms(10),
  },
  selectedOverlay: {
    height: ms(112),
    width: ms(112),
    borderRadius: ms(12),
    borderWidth: ms(1),
    borderColor: THEMES.colors.black,
    marginVertical: ms(10),
    backgroundColor: "#06AB78B8",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  petName: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
    textAlign: "center",
    marginVertical: ms(10),
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: ms(20),
  },
  button: {
    marginVertical: ms(10),
    backgroundColor: THEMES.colors.bottomBarGreen,
  },
});

export default React.memo(PetSelectionDialog);
