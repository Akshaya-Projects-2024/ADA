import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Text, StatusBar } from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";

const OtpScreen = (props) => {
  const value = props.route.params.loginValue;
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isMobileNumber, setIsMobileNumber] = useState(false);

  useEffect(() => {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(value)) {
      setIsMobileNumber(true);
    } else {
      setIsMobileNumber(false);
    }
  }, []);

  const handleChange = (text, index) => {
    if (/^[0-9]$/.test(text) || text === "") {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input field automatically
      if (text && index < 5) {
        const nextInput = index + 1;
        inputRefs[nextInput].focus();
      }
    }
  };

  // Refs to focus on the next input
  const inputRefs = [];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <Header title={""} showBack bgColor="transparent" />
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
            paddingHorizontal: moderateScale(20),
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
            {isMobileNumber ? "7977276381" : "john@example.com"}{" "}
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
});

export default OtpScreen;
