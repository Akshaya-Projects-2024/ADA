import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Trainer from "../../assets/svg/trainer.svg";
import Walker from "../../assets/svg/walker.svg";
import Behaviourist from "../../assets/svg/behaviour.svg";

import Groomer from "../../assets/svg/groomer.svg";
import Therapist from "../../assets/svg/therapist.svg";
import Communicator from "../../assets/svg/communicator.svg";
import Nurtitionist from "../../assets/svg/nurtitionist.svg";

import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Strings from "../../constants/strings";
import { showToast, validArray } from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import { getServices } from "../../redux-store/actions/auth";
import { getBase64Obj } from "../../utils/documentUtils";
import { SvgUri } from "react-native-svg";
const { width } = Dimensions.get("window");

// Mock data for icons and labels
// const services = [
//   { id: 1, title: "Trainer", icon: <Trainer /> },
//   { id: 2, title: "Behaviourist", icon: <Behaviourist /> },
//   { id: 3, title: "Pet Walker", icon: <Walker /> },
//   { id: 4, title: "Groomer", icon: <Groomer /> },
//   { id: 5, title: "Animal therapist", icon: <Therapist /> },
//   { id: 6, title: "Nutritionist", icon: <Nurtitionist /> },
//   { id: 7, title: "Restaurants", icon: <Groomer /> },
//   { id: 8, title: "Fresh Food", icon: <Groomer /> },
//   { id: 9, title: "Vets-Hospitals", icon: <Groomer /> },
//   { id: 10, title: "Pet NGO", icon: <Groomer /> },
//   { id: 11, title: "Boarding/Pet Sitter", icon: <Groomer /> },
//   { id: 12, title: "Animal Communicator", icon: <Communicator /> },
// ];

const ServiceList = (props) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const params = {
        service: "",
      };
      const response = await getServices(params);
      if (response?.status === 200) {
        const output = response?.data?.data;
        if (validArray(output)) {
          setServices(output);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error);
      setLoading(false);
      showToast("error", error?.message);
    }
  };

  const renderService = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          props.navigation.navigate("service", { selectedService: item })
        }
      >
        <View style={styles.iconContainer}>
          <SvgUri width={35} height={35} uri={item?.logo} />
        </View>
        <Text style={styles.itemText}>{item?.service}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={Strings.services}
        showBack
        fontColor="#EC559C"
        bgColor="transparent"
      />
      <View
        style={{
          paddingTop: moderateScale(20),
          paddingHorizontal: moderateScale(10),
          flex: 1,
        }}
      >
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item?.id.toString()}
          numColumns={3} // Number of columns for the grid
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {loading && (
        <View style={styles.loadingView}>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={THEMES.colors.white} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  listContent: {
    paddingVertical: 10, // Padding for the entire FlatList
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 30, // Space between rows
  },
  itemContainer: {
    width: (width - 40) / 3, // Dynamic width based on screen size
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#FBF7FF", // Light purple background
    height: 70,
    width: 70,
    borderRadius: 35,
    borderColor: "#AB47BC",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  itemText: {
    marginTop: 3,
    textAlign: "center",
    fontSize: THEMES.fonts.font13,
    color: "#AB47BC", // Purple text color
    fontFamily: THEMES.fontFamily.semiBold,
  },
  lastRowContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the last item(s) if less than 3
    marginBottom: 20,
  },
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
});

export default ServiceList;
