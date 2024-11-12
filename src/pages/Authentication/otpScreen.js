import React, { useEffect, useState, useRef } from "react";
import Toast from "react-native-toast-message";
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
} from "react-native";
import { moderateScale } from "react-native-size-matters";

import Header from "../../components/Header";
import Api from "../../api/Api";
import { THEMES } from "../../assets/theme/themes";
import { decryptService, encryptService } from "../../utils/storageFunc";
import { checkLogin, verifyOtp } from "../../redux-store/actions/auth";
import { getCurrentLocation } from "../../utils/geolocationUtils";

const OtpScreen = (props) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const value = props.route.params.loginValue;
  const [isMobileNumber, setIsMobileNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    // Request SMS permission on Android
    requestSmsPermission();
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

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

  useEffect(() => {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(value)) {
      setIsMobileNumber(true);
    } else {
      setIsMobileNumber(false);
    }

    requestSmsPermission();
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
        console.log("not granted")
      }
    } catch (error) {
      console.warn("error", error);
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
    console.log("napiCall")
    try {
      setLoading(true);
      Keyboard.dismiss();
      const currentPosition = await getCurrentLocation();
      const deviceId = await decryptService("deviceId");
      const postData = {
        UserId: value,
        Deviceid: deviceId,
        Otp: otpValue.join(""),
        type: "login",
        sessionId: "localsession",
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
        showToast("success", res?.data?.message);
        props?.navigation.replace("auth");
        setLoading(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        showToast("error", res?.data?.message);
        setLoading(false);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error) {
      showToast("error", "Something went wrong!!!");
      setLoading(false);
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
      setLoading(true);
      const deviceId = await decryptService("deviceId", deviceId);
      const postData = {
        UserId: value,
        Deviceid: deviceId,
      };
      const res = await checkLogin(postData);
      if (res?.data?.status_code == 200) {
        showToast("success", res?.data?.message);
        setIsRefresh(!isRefresh);
        setLoading(false);
      } else {
        setLoading(false);
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <StatusBar backgroundColor={THEMES.colors.white} />

        <View
          style={{
            flex: 1,
          }}
        >
          <Header title={""} showBack bgColor="transparent" />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: moderateScale(30),
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
              {`An ${
                isMobileNumber ? "OTP" : "email"
              } with a verification code has been sent to`}

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
              Enter the code here:
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
              Didn’t get a verification code?
            </Text>
          </View>
        </ScrollView>
        {loading && (
          <View style={styles.loadingView}>
            <View style={styles.loadingBox}>
              <ActivityIndicator color={THEMES.colors.white} />
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.white,
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
