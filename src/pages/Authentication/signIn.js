import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Keyboard,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import { getUniqueId } from "react-native-device-info";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { checkLogin } from "../../redux-store/actions/auth";
import { encryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";
import { contextValue } from "../../components/Loader";
import { dispathGuestUser } from "../../redux-store/actions/userActions";
import { useDispatch } from "react-redux";

const SignIn = (props) => {
  const [inputValue, setInputValue] = useState(""); //a@yopmail.com //9769487604 //"jogayex376@bawsny.com" //cicocaj728@evusd.com
  const dispatch = useDispatch();
  const onSubmit = async () => {
    if (!inputValue) {
      showToast("error", "Please enter Mobile number or Email Id");
    } else {
      try {
        contextValue?.setLoader(true);
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
            contextValue?.setLoader(false);
            setInputValue("");
          }, 500);
        } else {
          contextValue?.setLoader(false);
          setInputValue("");
          showToast("error", res?.data?.message);
        }
      } catch (error) {
        contextValue?.setLoader(false);
        setInputValue("");
        showToast("error", error?.message || "Something went wrong!!!");
      }
    }
  };

  const onLaterPressed = () => {
    dispatch(dispathGuestUser(true));
    setTimeout(() => {
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: "auth",
            state: {
              routes: [
                {
                  name: "home",
                },
              ],
            },
          },
        ],
      });
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
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
        <Button onPress={onSubmit} title={Strings.signWithOtp} />
        <View style={styles.skipButtonContainer} />
        <View style={styles.skipButton}>
          <Button onPress={null} title={Strings.skip} onlyBorder />
        </View>
      </View>
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
  },
  contentView: {
    backgroundColor: THEMES.colors.bgColor,
    paddingHorizontal: moderateScale(17),
    width: "100%",
    borderTopLeftRadius: moderateScale(39),
    borderTopRightRadius: moderateScale(39),
    flex: 1,
    marginTop: -moderateScale(39),
    paddingTop: moderateScale(65),
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
  skipButtonContainer: { flex: 1 },
  skipButton: { marginVertical: moderateScale(23) },
});

export default SignIn;
