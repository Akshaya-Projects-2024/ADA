import React, { useState } from "react";
import { View, Text, StatusBar } from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import SwitchIcon from "../../assets/svg/switch.svg";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import ModalDropdown from "../../components/ModalDropdown";
import Stepper from "../../components/Stepper";

const roles = [
  { id: "1", label: "Pet Training" },
  { id: "2", label: "Grooming" },
  { id: "3", label: "Walking" },
  { id: "4", label: "Pet Training" },
  { id: "5", label: "Grooming" },
  { id: "6", label: "Walking" },
  { id: "7", label: "Pet Training" },
  { id: "8", label: "Grooming" },
  { id: "9", label: "Walking" },
  { id: "1", label: "Pet Training" },
  { id: "2", label: "Grooming" },
  { id: "3", label: "Walking" },
  { id: "4", label: "Pet Training" },
  { id: "5", label: "Grooming" },
  { id: "6", label: "Walking" },
  { id: "7", label: "Pet Training" },
  { id: "8", label: "Grooming" },
  { id: "9", label: "Walking" },
];

const Home = (props) => {
  const [selectedValue, setSelectedValue] = useState();
  const { colors, fontFamily, fonts } = THEMES;
  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <Header customIcon={<SwitchIcon />} title={"Home"} showSearch />
      <Text
        style={{
          fontFamily: fontFamily.bold,
          fontSize: fonts.font20,
          color: colors.red,
        }}
      >
        Home
      </Text>
   
      <Button
        title="create event"
        onPress={() => props.navigation.navigate("createEvent")}
      ></Button>
    </View>
  );
};

export default Home;
