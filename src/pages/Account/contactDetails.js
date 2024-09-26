import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from "react-native";
import InputField from "../../components/InputField";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../utils/strings";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import Location from "../../assets/svg/location.svg";
import Stepper from "../../components/Stepper";

const ContactDetails = (props) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const route = props?.route?.params?.route;

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
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.contactDetails} showBack bgColor="transparent" />
      {route !== "myprofile" && (
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#B8B8B8",
          borderBottomColor: "#B8B8B8",
          borderBottomWidth: 1,
          backgroundColor: "#fff",
        }}
      >
        <Stepper currentStep={2} totalSteps={5} />
      </View>
      )}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={{ paddingHorizontal: moderateScale(20) }}>
            <View style={{ paddingTop: moderateScale(route !== "myprofile" ? 18: 30) }}>
              <InputField
                label={Strings.mobileNo}
                placeholderText={Strings.enterMobileNo}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.emailId}
                placeholderText={Strings.enterEmailId}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.address}
                placeholderText={Strings.enterAddress}
                multiline={true}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.location}
                placeholderText={Strings.enterLocation}
                rightIcon={<Location stroke={THEMES.colors.darkGrey} />}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.postalCode}
                placeholderText={Strings.enterPostalCode}
              />
            </View>
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button  title={route !== "myprofile" ? Strings.next : Strings.submit}
              onPress={() => props.navigation.navigate("uploadImagesDocs")}/>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(22),
  },
});

export default ContactDetails;
