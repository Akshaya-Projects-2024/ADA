import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { checkLogin } from "../../redux/action/auth";
import { decryptService } from "../../utils/storageFunc";
import { THEMES } from "../../assets/theme/themes";
import { screenHeight, screenWidth } from "../../utils/dimensions";

const Splash = (props) => {
  useFocusEffect(
    useCallback(() => {
        checkIfUserExits();
    }, [])
  );

  const checkIfUserExits = async () => {
    const data = await decryptService("accessToken");
    if (data) {
      setTimeout(() => {
        props?.navigation.replace("auth");
      }, 3000);
    } else {
      setTimeout(() => {
        props?.navigation.replace("app");
      }, 3000);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#04DBB0"} />
      <ImageBackground
        source={require("../../assets/images/splashS.png")}
        style={styles.img}
      >
        <Text style={styles.appText}>ADA</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  appText: {
    color: THEMES.colors.white,
    paddingTop: moderateScale(20),
    fontSize: moderateScale(50),
    fontFamily: THEMES.fontFamily.semiBold,
  },
  img: {
    width: screenWidth,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Splash;
