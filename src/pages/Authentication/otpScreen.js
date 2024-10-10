import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Strings from "../../constants/strings";
import { decryptService, encryptService } from "../../utils/storageFunc";
import { verifyOtp } from "../../redux-store/actions/auth";
import Toast from "react-native-toast-message";

const OtpScreen = (props) => {
  const value = props.route.params.loginValue;
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isMobileNumber, setIsMobileNumber] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(value)) {
      setIsMobileNumber(true);
    } else {
      setIsMobileNumber(false);
    }
  }, []);

  const showToast = (type, message) => {
    Toast.show({
      type: type,
      text1: message,
    });
  };

  const handleChange = async (text, index) => {
    if (/^[0-9]$/.test(text) || text === "") {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      // Move to next input field automatically
      if (text && index < 5) {
        const nextInput = index + 1;
        inputRefs[nextInput].focus();
      } else {
        if (index == 5 && text) {
          Keyboard.dismiss();
          try {
            setLoading(true);
            const deviceId = await decryptService("deviceId");
            const postData = {
              UserId: value,
              Deviceid: deviceId,
              Otp: newOtp.join(""),
              type: "login",
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
                setOtp(Array(6).fill(""));
              }, 500);
            } else {
              showToast("error", res?.data?.message);
              setLoading(false);
              setOtp(Array(6).fill(""));
            }
          } catch (error) {
            showToast("error", "Something went wrong!!!");
            setLoading(false);
            setOtp(Array(6).fill(""));
          }
        }
      }
    }
  };

  // Refs to focus on the next input
  const inputRefs = [];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title={""} showBack bgColor="transparent" />
      <ScrollView
       keyboardShouldPersistTaps='handled'
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
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(input) => (inputRefs[index] = input)}
              />
            ))}
          </View>
          <Text
            onPress={() => props.navigation.navigate("roleSelection")}
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
