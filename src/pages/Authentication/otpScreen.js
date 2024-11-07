import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import { decryptService, encryptService } from "../../utils/storageFunc";
import { verifyOtp } from "../../redux-store/actions/auth";
import Toast from "react-native-toast-message";
import SmsListener from "react-native-android-sms-listener";

const OtpScreen = (props) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const value = props.route.params.loginValue;
  const [isMobileNumber, setIsMobileNumber] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

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
      }
    } catch (error) {
      console.warn(error);
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
      Keyboard.dismiss();
      setLoading(true);
      const deviceId = await decryptService("deviceId");
      const postData = {
        UserId: value,
        Deviceid: deviceId,
        Otp: otpValue.join(""),
        type: "login",
        sessionId: "localsession",
        latitude: "488",
        longitude: "588",
      };

      const res = await verifyOtp(postData);
      if (res?.data?.status_code == 200) {
        await encryptService("accessToken", res?.data?.data?.token);
        await encryptService("tokenId", res?.data?.data?.tokenId);
        await encryptService("userId", value);
        showToast("success", res?.data?.message);
        setTimeout(() => {
          props?.navigation.replace("auth");
          setLoading(false);
          setOtp(["", "", "", "", "", ""]);
        }, 500);
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
    e;
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title={""} showBack bgColor="transparent" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: moderateScale(30),
            paddingTop: moderateScale(127),
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
              paddingTop: moderateScale(24),
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
                paddingTop: moderateScale(24),
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
              paddingTop: moderateScale(24),
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
            style={{
              color: THEMES.colors.blue,
              fontFamily: THEMES.fontFamily.medium,
              fontSize: THEMES.fonts.font12,
              textAlign: "center",
              paddingTop: moderateScale(24),
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
    paddingTop: moderateScale(24),
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
