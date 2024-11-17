import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { decryptService } from "../../utils/storageFunc";
import { THEMES } from "../../assets/theme/themes";
import { screenHeight, screenWidth } from "../../utils/dimensions";
import { getProfile } from "../../redux-store/actions/auth";
import { dispatchUserData } from "../../redux-store/actions/registerAction";
import { useDispatch } from "react-redux";

const Splash = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  // useFocusEffect(
  //   useCallback(() => {
  //     checkIfUserExits();
  //   }, [])
  // );

  useEffect(() => {
    if (isFocused) {
      checkIfUserExits();
    }
  }, [isFocused, checkIfUserExits]);

  const initData = useCallback(() => {
    return new Promise(async (resolve) => {
      try {
        const obj = {
          userid: await decryptService("userId"),
        };
        const response = await getProfile(obj);
        console.log(
          "🚀 ~ returnnewPromise ~ response?.data?.data:",
          response?.data?.data
        );
        // dispatch(saveRegisterData(response?.data?.data)); No need
        dispatch(dispatchUserData(response?.data?.data));
        resolve(response?.data?.data ? response?.data?.data : false);
      } catch (error) {
        console.log("err111", error);
        resolve(false);
      }
    });
  }, [dispatch]);

  const validateServiceProfile = (userData) => {};

  const validateParentProfile = (userData) => {};

  const checkIfUserExits = useCallback(async () => {
    const data = await decryptService("accessToken");
    if (data) {
      const userData = await initData();
      if (validateParentProfile(userData) && validateServiceProfile(userData)) {
        props?.navigation.replace("auth");
      } else if (validateServiceProfile(userData)) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "home" }],
        });
      } else if (validateParentProfile(userData)) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "petParentAppStack" }],
        });
      } else {
        props?.navigation.replace("auth");
      }
    } else {
      props?.navigation.replace("app");
    }
  }, [initData, props.navigation]);

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
