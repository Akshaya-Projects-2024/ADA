import React from "react";
import { View, Text, StatusBar } from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import SwitchIcon from "../../assets/svg/switch.svg";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";

const Home = (props) => {
  const { colors, fontFamily, fonts } = THEMES;
  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor, marginHorizontal:moderateScale(20) }}>
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
