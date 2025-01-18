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
import Strings from "../../constants/strings";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import Location from "../../assets/svg/location.svg";
import Stepper from "../../components/Stepper";
import { saveContactDetails } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { useSelector } from "react-redux";
import { showToast } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";

const ContactDetails = (props) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const route = props?.route?.params?.route;
  const { providerProfile } = useSelector((state) => state?.commonReducer);
  const { providerContact } = providerProfile;
  const [mobileNo, setMobileNo] = useState();
  const [emailId, setEmailId] = useState();
  const [address, setAddress] = useState();
  const [postalCode, setPostalCode] = useState();
  const [location, setLocation] = useState();

  useEffect(() => {
    initData();
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

  const initData = () => {
    if (providerContact?.address) {
      setAddress(providerContact?.address);
    }
    if (providerContact?.email) {
      setEmailId(providerContact?.email);
    }
    if (providerContact?.location) {
      setLocation(providerContact?.location);
    }
    if (providerContact?.mobile) {
      setMobileNo(providerContact?.mobile);
    }
    if (providerContact?.pin) {
      setPostalCode(providerContact?.pin);
    }
  };

  const onSubmit = async () => {
    if (!mobileNo) {
      showToast("error", "Please enter mobile number");
    } else if (!emailId) {
      showToast("error", "Please enter email Id");
    } else if (!address) {
      showToast("error", "Please enter address");
    } else if (!location) {
      showToast("error", "Please enter your location");
    } else if (!postalCode) {
      showToast("error", "Please enter your postal code");
    } else {
      try {
        const userId = await decryptService("userId");
        const postData = {
          userid: userId,
          mobile: mobileNo,
          email: emailId,
          address: address,
          location: location,
          pin: postalCode,
          ...(providerContact?.id ? { id: providerContact?.id } : {}),
        };
        const res = await saveContactDetails(postData);
        if (res?.data?.status_code == 200) {
          props.navigation.navigate(
            "uploadImagesDocs",
            route ? { route: route } : {}
          );
        } else {
          showToast("error", res?.data?.message);
        }
      } catch (error) {
        showToast("error", "Something went wrong!!!");
      }
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
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
          <Stepper currentStep={2} totalSteps={6} />
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
            <View
              style={{
                paddingTop: moderateScale(route !== "myprofile" ? 18 : 30),
              }}
            >
              <InputField
                maxLength={10}
                keyboardType="phone-pad"
                label={Strings.mobileNo}
                placeholderText={Strings.enterMobileNo}
                value={mobileNo}
                onChange={setMobileNo}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.emailId}
                placeholderText={Strings.enterEmailId}
                value={emailId}
                onChange={setEmailId}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.address}
                placeholderText={Strings.enterAddress}
                multiline={true}
                value={address}
                onChange={setAddress}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                label={Strings.location}
                placeholderText={Strings.enterLocation}
                rightIcon={<Location stroke={THEMES.colors.darkGrey} />}
                value={location}
                onChange={setLocation}
              />
            </View>
            <View style={{ paddingTop: moderateScale(16) }}>
              <InputField
                maxLength={6}
                keyboardType="phone-pad"
                label={Strings.postalCode}
                placeholderText={Strings.enterPostalCode}
                value={postalCode}
                onChange={setPostalCode}
              />
            </View>
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button
              title={route !== "myprofile" ? Strings.next : Strings.submit}
              onPress={() => onSubmit()}
            />
          </View>
        )}
      </View>
    </View>
    </SafeAreaView>
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
