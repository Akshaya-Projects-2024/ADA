import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
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
const { width } = Dimensions.get("window");

// Mock data for icons and labels
const services = [
  { id: 1, title: "Trainer", icon: <Trainer /> },
  { id: 2, title: "Behaviourist", icon: <Behaviourist /> },
  { id: 3, title: "Pet Walker", icon: <Walker /> },
  { id: 4, title: "Groomer", icon: <Groomer /> },
  { id: 5, title: "Animal therapist", icon: <Therapist /> },
  { id: 6, title: "Nutritionist", icon: <Nurtitionist /> },
  { id: 7, title: "Restaurants", icon: <Groomer /> },
  { id: 8, title: "Fresh Food", icon: <Groomer /> },
  { id: 9, title: "Vets-Hospitals", icon: <Groomer /> },
  { id: 10, title: "Pet NGO", icon: <Groomer /> },
  { id: 11, title: "Boarding/Pet Sitter", icon: <Groomer /> },
  { id: 12, title: "Animal Communicator", icon: <Communicator /> },
];


const ServiceList = (props) => {

    const renderService = ({ item }) => {
        const Icon = item.icon;
        return (
          <TouchableOpacity style={styles.itemContainer} onPress={()=>props.navigation.navigate('service')}>
            <View style={styles.iconContainer}>{Icon}</View>
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        );
      };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={"Services"}
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
          keyExtractor={(item) => item.id.toString()}
          numColumns={3} // Number of columns for the grid
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#FBF7FF", // Light purple background
    borderRadius: 50, // Circular container
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
});

export default ServiceList;
