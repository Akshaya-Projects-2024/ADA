import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import { getUniqueId } from "react-native-device-info";
import { moderateScale, s } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Toast from "react-native-toast-message";
import { checkLogin } from "../../redux-store/actions/auth";
import { encryptService } from "../../utils/storageFunc";
import Loader from "../../components/Loader";

const SignIn = (props) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [inputValue, setInputValue] = useState("akshaya.chikane2018@gmail.com");
  const [loading, setLoading] = useState(false);

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

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

  const onSubmit = async () => {
    if (!inputValue) {
      showToast("error", "Please enter Mobile number or Email Id");
    } else {
      try {
        setLoading(true);
        Keyboard.dismiss();
        const deviceId = await getUniqueId();
        await encryptService("deviceId", deviceId);
        const postData = {
          UserId: inputValue,
          Deviceid: deviceId,
        };
        
        const res = await checkLogin(postData);
        if (res?.data?.status_code == 200) {
          showToast("success", res?.data?.message);
          setTimeout(() => {
            props.navigation.navigate("otpScreen", { loginValue: inputValue });
            setLoading(false);
            setInputValue("");
          }, 500);
        } else {
          setLoading(false);
          setInputValue("");
          showToast("error", res?.data?.message);
        }
      } catch (error) {
        setLoading(false);
        setInputValue("");
        showToast("error", "Something went wrong!!!");
      }
    }
  };

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
        <Button onPress={() => onSubmit()} title={Strings.signWithOtp} />
      </View>

      {loading && (
        <View style={styles.loadingView}>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={THEMES.colors.white} />
          </View>
        </View>
      )}

      {/* {!isKeyboardVisible && (
        <View style={styles.skipBtn}>
          <Button
            onPress={() => props.navigation.navigate("home")}
            title={Strings.skip}
            onlyBorder
          />
        </View>
      )} */}
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

export default SignIn;
