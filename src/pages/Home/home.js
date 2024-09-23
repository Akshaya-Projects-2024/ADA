import React from "react";
import { View, Text, StatusBar } from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import SwitchIcon from "../../assets/svg/switch.svg";

const Home = (props) => {
  const { colors, fontFamily, fonts } = THEMES;
  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <Header
        customIcon={<SwitchIcon />}
        title={"Create event"}
        showSearch
        onSearchPress={() => props.navigation.navigate("selectDate")}
      />
      <Text
        style={{
          fontFamily: fontFamily.bold,
          fontSize: fonts.font20,
          color: colors.red,
        }}
      >
        Home
      </Text>
    </View>
  );
};

export default Home;
