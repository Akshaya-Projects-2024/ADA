import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Keyboard,
} from "react-native";

import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";

import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

const SignIn = (props) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/signin.jpeg")}
        resizeMode="cover"
        style={styles.imgBackground}
      />

      <View style={styles.contentView}>
        <Text style={styles.signInText}>{Strings.signIn}</Text>
        <View style={styles.inputStyle}>
          <InputField
            label={Strings.mobileNoEmail}
            placeholderText={Strings.entermobileEmail}
            value={inputValue}
            onChange={setInputValue}
          />
        </View>
        <Button
          onPress={() =>
            props.navigation.navigate("otpScreen", { loginValue: inputValue })
          }
          title={Strings.signWithOtp}
        />
      </View>

      {!isKeyboardVisible && (
        <View style={styles.skipBtn}>
          <Button title={Strings.skip} onlyBorder />
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
  imgBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 415,
  },
  contentView: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    paddingHorizontal: moderateScale(17),
    width: "100%",
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    flex: 1,
    paddingTop: moderateScale(61),
  },
  signInText: {
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font24,
    color: THEMES.colors.outrageousOrange,
    textAlign: "center",
  },
  skipBtn: {
    paddingHorizontal: moderateScale(18),
    marginBottom: moderateScale(20),
  },
  inputStyle: {
    paddingVertical: moderateScale(23),
  },
});

export default SignIn;
