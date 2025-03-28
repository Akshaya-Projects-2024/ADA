import React, { useEffect, useState, useRef } from "react";
import SmsListener from "react-native-android-sms-listener";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
  PermissionsAndroid,
  Alert,
  Linking,
} from "react-native";
import { moderateScale, ms } from "react-native-size-matters";

import Header from "../../components/Header";
import Api from "../../api/Api";
import { THEMES } from "../../assets/theme/themes";
import { decryptService, encryptService } from "../../utils/storageFunc";
import {
  checkLogin,
  getProfile,
  verifyOtp,
} from "../../redux-store/actions/auth";
import { getCurrentLocation } from "../../utils/geolocationUtils";
import { showToast } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { dispatchUserData } from "../../redux-store/actions/registerAction";
import {
  validateParentProfile,
  validateServiceProfile,
} from "../../utils/userUtils";
import { contextValue } from "../../components/Loader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNotificationToken } from "../../utils/pushNotificationUtils";
import { validateInput } from "../../utils/validation";
import { LoginModules } from "../../constants/enums";
import {
  navigateToParent,
  navigateToServiceProvider,
} from "../../navigations/rootNavigationRef";

const OtpScreen = (props) => {
  const { top } = useSafeAreaInsets();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const value = props?.route?.params?.loginValue;
  const [isMobileNumber, setIsMobileNumber] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (validateInput(value) == "mobile") {
      requestSmsPermission();
    }
    // Request SMS permission on Android
    // Start listening for SMS messages
    const subscription = SmsListener.addListener((message) => {
      const otpMatch = message.body.match(/\b\d{6}\b/);
      if (otpMatch) {
        autoFillOtp(otpMatch[0]);
      } else {
        Alert.alert("Error", "OTP not found in the message");
      }
    });
    return () => {
      subscription.remove(); // Clean up listener on unmount
    };
  }, [isRefresh]);

  useEffect(() => {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(value)) {
      setIsMobileNumber(true);
    } else {
      setIsMobileNumber(false);
    }

    if (validateInput(value) == "mobile") {
      requestSmsPermission();
    }
    // Start listening for SMS messages
    const subscription = SmsListener.addListener((message) => {
      const otpMatch = message.body.match(/\b\d{6}\b/);
      if (otpMatch) {
        autoFillOtp(otpMatch[0]);
      } else {
        Alert.alert("Error", "OTP not found in the message");
      }
    });
    return () => {
      subscription.remove(); // Clean up listener on unmount
    };
  }, []);

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: "SMS Permission",
          message:
            "This app requires access to read SMS messages for OTP auto-fill",
          buttonPositive: "OK",
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Linking.openSettings();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const autoFillOtp = (otpString) => {
    const otpArray = otpString.split(""); // Convert OTP to array
    setOtp(otpArray); // Set OTP state to fill input boxes

    // Optionally focus the last input to indicate completion
    if (inputs.current[5]) {
      inputs.current[5].focus();
      apiCall(otpArray);
    }
  };

  const apiCall = async (otpValue) => {
    try {
      contextValue?.setLoader(true);
      Keyboard.dismiss();
      const currentPosition = await getCurrentLocation();
      const deviceId = await decryptService("deviceId");
      let fcmToken = await decryptService("@fcmToken");
      if (!fcmToken) {
        fcmToken = await getNotificationToken();
        await encryptService("@fcmToken", fcmToken);
      }
      const postData = {
        UserId: value,
        Deviceid: deviceId,
        Otp: otpValue.join(""),
        type: "login",
        sessionId: fcmToken,
        latitude: currentPosition?.coords?.latitude
          ? currentPosition?.coords?.latitude?.toString()
          : "0",
        longitude: currentPosition?.coords?.longitude
          ? currentPosition?.coords?.longitude?.toString()
          : "0",
      };
      const res = await verifyOtp(postData);
      if (res?.data?.status_code == 200) {
        await encryptService("accessToken", res?.data?.data?.token);
        await encryptService("tokenId", res?.data?.data?.tokenId);
        await encryptService("userId", value);
        const header = {
          AccessToken: `${res?.data?.data?.token}`,
        };
        Api.defaultHeader(header);
        const obj = {
          userid: await decryptService("userId"),
        };
        const response = await getProfile(obj);
        if (response?.data?.status_code == 200) {
          showToast("success", res?.data?.message);
          contextValue?.setLoader(false);
          setOtp(["", "", "", "", "", ""]);
          // dispatch(saveRegisterData(response?.data?.data)); No need
          dispatch(dispatchUserData(response?.data?.data));
          const loggedInModule = await decryptService("loggedInModule");
          const userData = response?.data?.data?.logindetails;
          if (loggedInModule) {
            if (loggedInModule === LoginModules.parent) {
              navigateToParent(props?.navigation);
            } else {
              navigateToServiceProvider(props?.navigation);
            }
          } else if (userData?.isparent && userData?.isprovider) {
            props?.navigation.replace("auth");
          } else if (userData?.isparent) {
            navigateToParent(props?.navigation);
          } else if (userData?.isprovider) {
            navigateToServiceProvider(props?.navigation);
          } else {
            props?.navigation.replace("auth");
          }
        }
      } else {
        showToast("error", res?.data?.message);
        contextValue?.setLoader(false);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error) {
      showToast("error", error?.message || "Something went wrong!!!");
      contextValue?.setLoader(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleChange = async (text, index) => {
    if (text.length > 1) {
      text = text.slice(-1); // Ensure only one digit is entered
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    } else {
      if (index == 5 && text) {
        apiCall(newOtp);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const resendOtp = async () => {
    try {
      contextValue?.setLoader(true);
      const deviceId = await decryptService("deviceId", deviceId);
      const postData = {
        UserId: value,
        Deviceid: deviceId,
      };
      const res = await checkLogin(postData);
      if (res?.data?.status_code == 200) {
        showToast("success", res?.data?.message);
        setIsRefresh(!isRefresh);
        contextValue?.setLoader(false);
      } else {
        contextValue?.setLoader(false);
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.message || "Something went wrong!!!");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={"dark-content"}
      />
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        resizeMode="cover"
        style={{ flex: 1, paddingTop: moderateScale(top) }}
      >
        <Header title={""} showBack bgColor="transparent" />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: moderateScale(30),
              marginTop: "30%",
            }}
          >
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font20,
                textAlign: "center",
                paddingHorizontal: moderateScale(50),
              }}
            >
              {isMobileNumber
                ? "Verify your Mobile number"
                : "Verify your email address"}
            </Text>
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.regular,
                fontSize: THEMES.fonts.font14,
                textAlign: "center",
                lineHeight: 22,
                paddingTop: moderateScale(15),
                paddingHorizontal: moderateScale(10),
              }}
            >
              {`An ${isMobileNumber ? "OTP" : "email"} has been sent to`}

              <Text
                style={{
                  color: THEMES.colors.black,
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font14,
                  textAlign: "center",
                  lineHeight: 30,
                  paddingTop: moderateScale(15),
                }}
              >
                {" "}
                {isMobileNumber ? value : value}{" "}
              </Text>
            </Text>
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.regular,
                fontSize: THEMES.fonts.font14,
                textAlign: "center",
                paddingTop: moderateScale(15),
              }}
            >
              Enter the OTP here:
            </Text>

            <View style={styles.otpContainer}>
              {otp.length &&
                otp?.map((digit, index) => (
                  <TextInput
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    key={index}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={(el) => (inputs.current[index] = el)}
                  />
                ))}
            </View>
            <Text
              onPress={() => resendOtp()}
              style={{
                color: THEMES.colors.blue,
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font12,
                textAlign: "center",
                paddingTop: moderateScale(15),
              }}
            >
              Didn’t get a verification OTP?
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: moderateScale(20),
  },
  otpInput: {
    borderWidth: 1,
    borderColor: THEMES.colors.black,
    width: 47,
    height: 47,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    textAlign: "center",
    borderRadius: 8,
    fontFamily: THEMES.fontFamily.semiBold,
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

export default OtpScreen;
