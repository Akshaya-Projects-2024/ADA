import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import Strings from "../../constants/strings";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import ModalDropdown from "../../components/ModalDropdown";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Paw from "../../assets/svg/paw.svg";
import Pencil from "../../assets/svg/pencil.svg";
import Modal from "react-native-modal";
import UploadImageModal from "../../components/UploadImageModal";
import CrossCircle from "../../assets/svg/crossCircle.svg";
import Cross from "../../assets/svg/cross.svg";


const petType = [
  { id: "1", label: "Pet Training" },
  { id: "2", label: "Grooming" },
  { id: "3", label: "Pet Boarding" },
];

const PetDetail = (props) => {
  const route = props?.route?.params?.route;
  const [selectedPetType, setSelectedPetType] = useState();
  const [selectedGender, setSelectedGender] = useState(null);
  const [petImage, setPetImage] = useState([]);
  const [petImagesVisible, setPetImageVisible] = useState(false);

  const [medicalDocument, setMedicalDocument] = useState([]);
  const [medicalVisible, setMedicalVisible] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  const handlePetImg = (image) => {
    var temp = [...petImage];
    temp.push(image);
    setPetImage(temp);
  };

  const handleDocuments = (image) => {
    var temp = [...medicalDocument];
    temp.push(image);
    setMedicalDocument(temp);
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  const renderItem = (item, index) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity
          onPress={() => {
            const removeItemById = petImage.filter(
              (item) => item?.fileData !== photo
            );
            setPetImage(removeItemById);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMedicalItem = (item, index) => {
    const photo = item?.item.fileData;
    return (
      <View style={styles.imgContent}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={getBase64Obj(photo)}
        />
        <TouchableOpacity
          onPress={() => {
            const removeItemById = medicalDocument.filter(
              (item) => item?.fileData !== photo
            );
            setMedicalDocument(removeItemById);
          }}
          style={styles.crossView}
        >
          <CrossCircle stroke={THEMES.colors.black} style={styles.crossImg} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={"Pet details"} showBack bgColor="transparent" />
      {route !== "parentAccount" && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#B8B8B8",
            borderBottomColor: "#B8B8B8",
            borderBottomWidth: 1,
            backgroundColor: "#fff",
          }}
        >
          <Stepper currentStep={2} totalSteps={2} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ alignSelf: "center", paddingTop: moderateScale(32) }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#ddd",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Paw />
            </View>
            {/* Edit Icon */}
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                backgroundColor: "#00ACC1",
                borderRadius: 20,
                padding: 5,
              }}
            >
              <Pencil />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"Pet Name*"}
              placeholderText={"Enter pet name"}
            />
          </View>

          <View style={{ paddingTop: moderateScale(16) }}>
            <ModalDropdown
              placeholder="Service provider Role*"
              data={petType}
              title={"Select service role"}
              setSelectedValue={setSelectedPetType}
              selectedValue={selectedPetType}
            />
          </View>
          <View style={{ paddingTop: moderateScale(16) }}>
            <ModalDropdown
              placeholder="Service provider Role*"
              data={petType}
              title={"Select service role"}
              setSelectedValue={setSelectedPetType}
              selectedValue={selectedPetType}
            />
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField label={"Age*"} placeholderText={"Enter age"} />
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor:
                    selectedGender === "Male"
                      ? THEMES.colors.cyan
                      : THEMES.colors.white,
                },
              ]}
              onPress={() => setSelectedGender("Male")}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      selectedGender === "Male"
                        ? THEMES.colors.white
                        : THEMES.colors.cyan,
                  },
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor:
                    selectedGender === "Female"
                      ? THEMES.colors.cyan
                      : THEMES.colors.white,
                },
              ]}
              onPress={() => setSelectedGender("Female")}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      selectedGender === "Female"
                        ? THEMES.colors.white
                        : THEMES.colors.cyan,
                  },
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField label={"Weight"} placeholderText={"Enter weight"} />
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <InputField
              label={"About Pet"}
              placeholderText={"Enter about Pet"}
              multiline
            />
          </View>
          <View
            style={{
              paddingTop: moderateScale(16),
              paddingHorizontal: moderateScale(20),
            }}
          ></View>
          <View
            style={{
              paddingHorizontal: moderateScale(20),
              marginBottom: moderateScale(30),
            }}
          >
            <View style={styles.secondaryFlex}>
              <Text style={styles.titleText}>Pet Images</Text>
              <TouchableOpacity onPress={() => setPetImageVisible(true)}>
                <Text style={styles.addText}>{Strings.add}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.flatlistView,
                {
                  alignItems: petImage?.length == 0 ? "center" : "flex-start",
                },
              ]}
            >
              <FlatList
                horizontal={true}
                contentContainerStyle={{
                  justifyContent: petImage?.length ? "flex-start" : "center",
                  alignItems: "center",
                  padding: petImage?.length
                    ? moderateScale(0)
                    : moderateScale(16),
                  borderColor: THEMES.colors.darkGrey,
                  borderRadius: 10,
                }}
                showsHorizontalScrollIndicator={false}
                data={petImage}
                renderItem={renderItem}
                ListHeaderComponent={() =>
                  petImage?.length == 0 ? (
                    <Text style={styles.imgPlaceholder}>
                      {Strings.pleaseAddImg}
                    </Text>
                  ) : null
                }
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: moderateScale(20),
              marginBottom: moderateScale(30),
            }}
          >
            <View style={styles.secondaryFlex}>
              <Text style={styles.titleText}>Medical Documents</Text>
              <TouchableOpacity onPress={() => setMedicalVisible(true)}>
                <Text style={styles.addText}>{Strings.add}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.flatlistView,
                {
                  alignItems:
                    medicalDocument?.length == 0 ? "center" : "flex-start",
                },
              ]}
            >
              <FlatList
                horizontal={true}
                contentContainerStyle={{
                  justifyContent: medicalDocument?.length
                    ? "flex-start"
                    : "center",
                  alignItems: "center",
                  padding: medicalDocument?.length
                    ? moderateScale(0)
                    : moderateScale(16),
                  borderColor: THEMES.colors.darkGrey,
                  borderRadius: 10,
                }}
                showsHorizontalScrollIndicator={false}
                data={medicalDocument}
                renderItem={renderMedicalItem}
                ListHeaderComponent={() =>
                  medicalDocument?.length == 0 ? (
                    <Text style={styles.imgPlaceholder}>
                      {Strings.pleaseAddImg}
                    </Text>
                  ) : null
                }
              />
            </View>
          </View>
          <View
            style={{
              paddingTop: moderateScale(20),
              paddingBottom: moderateScale(20),
              paddingHorizontal: moderateScale(16),
            }}
          >
            <Button title="Submit" onPress={() => setRegisterModal(true)} />
          </View>
        </ScrollView>
      </View>
      <UploadImageModal
        isVisible={petImagesVisible}
        onClose={() => setPetImageVisible(false)}
        handleSelectedImage={(image) => handlePetImg(image)}
      />
      <UploadImageModal
        isVisible={medicalVisible}
        onClose={() => setMedicalVisible(false)}
        handleSelectedImage={(image) => handleDocuments(image)}
      />
      <Modal
        onBackdropPress={() => setRegisterModal(false)}
        transparent={true}
        animationType="none"
        style={{
          margin: 0,
        }}
        visible={registerModal}
        onRequestClose={() => setRegisterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font20,
                  color: THEMES.colors.black,
                  width: "75%",
                  lineHeight: moderateScale(28),
                }}
              >
                Registration Complete! 🎉
              </Text>
              <TouchableOpacity onPress={() => setRegisterModal(false)}>
                <Cross />
              </TouchableOpacity>
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.regular,
                  fontSize: THEMES.fonts.font16,
                  color: THEMES.colors.black,
                  lineHeight: moderateScale(28),
                }}
              >
                Thank you for registering on ADA.
              </Text>
            </View>
            <View style={{ paddingTop: moderateScale(10) }}>
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.regular,
                  fontSize: THEMES.fonts.font16,
                  color: THEMES.colors.black,
                  lineHeight: moderateScale(28),
                }}
              >
                Happy exploring!
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: moderateScale(31),
              }}
            >
              <View style={{ width: "40%" }}>
                <Button
                  title="Close"
                  onPress={() => {
                    setRegisterModal(false);
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: "petParentAppStack" }],
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(22),
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(15),
    paddingTop: moderateScale(16),
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    width: "45%",
    alignItems: "center",
    borderColor: THEMES.colors.cyan,
    borderBottomLeftRadius: 0,
  },
  toggleText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.cyan,
  },
  secondaryFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.darkGrey,
  },
  addText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.cyan,
  },
  flatlistView: {
    marginTop: moderateScale(5),
    borderWidth: 1,
    borderColor: THEMES.colors.iron,
    borderRadius: 8,
    backgroundColor: THEMES.colors.white,
  },
  imgPlaceholder: {
    width: "100%",
    textAlign: "center",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
  },
  imgContent: {
    width: 60,
    height: 60,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 10,
    marginLeft: 16,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(16),
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEMES.colors.darkGrey,
  },
  crossView: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    left: 5,
    bottom: 5,
  },
  crossImg: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: moderateScale(20),
  },
  modalContent: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: moderateScale(20),
  },
});

export default PetDetail;
