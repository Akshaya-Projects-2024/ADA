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
import { StackActions } from "@react-navigation/native";
import { useUser } from "../../api/UserContext";
import {
  validateIndianPostalCode,
  validateInput,
} from "../../utils/validation";
// Add these imports at the top
import Dialog from "../../components/Dialog";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

const ContactDetails = (props) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const route = props?.route?.params?.route;
  const { providerProfile, logindetails } = useSelector(
    (state) => state?.commonReducer
  );
  const { providerContact } = providerProfile;
  const [mobileNo, setMobileNo] = useState();
  const [emailId, setEmailId] = useState();
  const [address, setAddress] = useState();
  const [postalCode, setPostalCode] = useState();
  const [location, setLocation] = useState();
  const { userData, apiInitCall } = useUser();

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

  const initData = async () => {
    let userId = await decryptService("userId");
    let input = validateInput(userId);

    if (input == "email") {
      setEmailId(userId);
    } else {
      setMobileNo(userId);
    }

    if (providerContact?.address) {
      setAddress(providerContact?.address);
    }
    if (providerContact?.email && input !== "email") {
      setEmailId(providerContact?.email);
    }
    if (providerContact?.location) {
      setLocation(providerContact?.location);
    }
    if (providerContact?.mobile && input !== "mobile") {
      setMobileNo(providerContact?.mobile);
    }
    if (providerContact?.pin) {
      setPostalCode(providerContact?.pin);
    }
  };

  const onSubmit = async () => {
    if (!mobileNo) {
      showToast("error", "Please enter mobile number");
    } else if (validateInput(mobileNo) == "invalid") {
      showToast("error", "Please enter valid mobile number");
    } else if (!emailId) {
      showToast("error", "Please enter email Id");
    } else if (validateInput(emailId) == "invalid") {
      showToast("error", "Please enter valid email Id");
    } else if (!address) {
      showToast("error", "Please enter address");
    } else if (!location) {
      showToast("error", "Please enter your location");
    } else if (!postalCode) {
      showToast("error", "Please enter your postal code");
    } else if (!validateIndianPostalCode(postalCode)) {
      showToast("error", "Please enter valid postal code");
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
          if (route === "myprofile") {
            props.navigation.dispatch(StackActions.pop(1));
          } else {
            props.navigation.navigate(
              "uploadImagesDocs",
              route ? { route: route } : {}
            );
          }
        } else {
          showToast("error", res?.data?.message);
        }
        apiInitCall();
      } catch (error) {
        showToast("error", "Something went wrong!!!");
      }
    }
  };

  // Add these state variables with existing states
  const [isSubmit, setIsSubmit] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Add this function after other function declarations
  const editPopup = () => {
    setEditModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header 
          title={Strings.contactDetails} 
          showBack 
          bgColor="transparent"
          right={
            route === "myprofile" ? (
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => editPopup()}
              >
                <FontAwesome
                  size={20}
                  name="edit"
                  color={THEMES.colors.black}
                />
              </TouchableOpacity>
            ) : null
          }
        />
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
            <View pointerEvents={isSubmit ? "auto" : "none"}>
              {/* Wrap your existing form elements with this View */}
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
            </View>
          </ScrollView>
          {(!isKeyboardVisible && (route !== "myprofile" || isSubmit)) && (
            <View style={styles.submitButton}>
              <Button
                title={route !== "myprofile" ? Strings.next : Strings.submit}
                onPress={() => onSubmit()}
              />
            </View>
          )}
        </View>

        {/* Add Dialog component at the end of the container View */}
        <Dialog
          flag={editModal}
          description={"Are you sure you want to edit this contact details?"}
          leftButtonText="No"
          rightButtonText="Yes"
          leftButtonPressed={() => {
            setEditModal(false);
            setIsSubmit(false);
          }}
          rightButtonPressed={() => {
            setIsSubmit(true);
            setEditModal(false);
          }}
          onClose={() => setEditModal(false)}
          title="Edit Contact Details"
        />
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
