import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import Strings from "../../constants/strings";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Stepper from "../../components/Stepper";
import User from "../../assets/svg/user.svg";
import Pencil from "../../assets/svg/pencil.svg";
import Location from "../../assets/svg/location.svg";
import UploadImageModal from "../../components/UploadImageModal";
import { decryptService, encryptService } from "../../utils/storageFunc";
import {
  getProfile,
  saveParentDetails,
  uploadParentDocument,
} from "../../redux-store/actions/auth";
import { showToast } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentLocation } from "../../utils/geolocationUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import { dispatchUserData } from "../../redux-store/actions/registerAction";
import { useUser } from "../../api/UserContext";
import { contextValue } from "../../components/Loader";
import {
  isValidName,
  validateIndianPostalCode,
  validateInput,
} from "../../utils/validation";
import { LoginModules } from "../../constants/enums";

const ParentDetails = (props) => {
  const route = props?.route?.params?.route;
  const { parentProfie, providerProfile, logindetails } = useSelector(
    (state) => state?.commonReducer
  );
  const dispatch = useDispatch();

  const { parentContact } = parentProfie;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [parentImg, setParentImg] = useState();

  const [parentName, setParentName] = useState();
  const [description, setDescription] = useState();
  const [mobileNumber, setMobileNumber] = useState(
    providerProfile?.providerContact?.mobile || undefined
  );
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [emailId, setEmailId] = useState(
    providerProfile?.providerContact?.email || undefined
  );
  const [pinCode, setPincode] = useState();
  const { apiInitCall } = useUser();

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
      setMobileNumber(userId);
    }

    if (parentContact?.about) {
      setDescription(parentContact?.about);
    }
    if (parentContact?.address) {
      setAddress(parentContact?.address);
    }
    if (parentContact?.email) {
      setEmailId(parentContact?.email);
    }
    if (parentContact?.mobile) {
      setMobileNumber(parentContact?.mobile);
    }
    if (parentContact?.name) {
      setParentName(parentContact?.name);
    }
    if (parentContact?.pin) {
      setPincode(parentContact?.pin);
    }
    if (logindetails?.parentphoto) {
      setParentImg(logindetails?.parentphoto);
    }
  };

  const handleLogo = async (image) => {
    setParentImg(image?.fileData);
    const extension = image?.uri?.split(".").pop();
    const userId = await decryptService("userId");

    let payload = {
      userid: userId,
      usertype: "parent",
      extention: extension,
      document: image?.fileData,
    };
    apiCall(payload);
  };

  const apiCall = async (postData, type, item) => {
    try {
      const res = await uploadParentDocument(postData);
      if (res?.status == 200) {
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const getBase64Obj = (url) => {
    if (url) {
      return {
        uri: url.includes("https") ? url : `data:image/jpg;base64,${url}`,
      };
    }
  };

  const onSubmit = async () => {
    if (!parentImg) {
      showToast("error", "Please upload parent profile picture");
    } else if (!parentName) {
      showToast("error", "Please enter your parent name");
    } else if (!isValidName(parentName)) {
      showToast("error", "Please enter valid parent name");
    } else if (!description) {
      showToast("error", "Please enter description");
    } else if (!mobileNumber) {
      showToast("error", "Please enter mobile number");
    } else if (validateInput(mobileNumber) == "invalid") {
      showToast("error", "Please enter valid mobile number");
    } else if (!emailId) {
      showToast("error", "Please enter email Id");
    } else if (validateInput(emailId) == "invalid") {
      showToast("error", "Please enter valid email Id");
    } else if (!address) {
      showToast("error", "Please enter address");
    } else if (!pinCode) {
      showToast("error", "Please enter pincode");
    } else if (!validateIndianPostalCode(pinCode)) {
      showToast("error", "Please enter valid postal code");
    } else {
      try {
        contextValue?.setLoader(true);
        const userId = await decryptService("userId");
        const currentPosition = await getCurrentLocation();
        const postData = {
          userid: userId,
          name: parentName,
          about: description,
          mobile: mobileNumber,
          email: emailId,
          address: address,
          pin: pinCode,
          lat: currentPosition?.coords?.latitude
            ? currentPosition?.coords?.latitude?.toString()
            : "0",
          lang: currentPosition?.coords?.longitude
            ? currentPosition?.coords?.longitude?.toString()
            : "0",
          ...(parentContact?.id ? { id: parentContact?.id } : {}),
        };
        const res = await saveParentDetails(postData);
        if (res?.data?.status_code == 200) {
          if (route === "parentAccount") {
            await encryptService("loggedInModule", LoginModules.parent);
            props.navigation.dispatch(StackActions.pop(1));
          } else {
            props.navigation.navigate(
              "petDetail",
              route ? { route: route } : {}
            );
            showToast("success", res?.data?.message);
          }
        } else {
          showToast("error", res?.data?.message);
        }
        apiInitCall();
        contextValue?.setLoader(false);
      } catch (error) {
        showToast("error", "Something went wrong!!!");
        contextValue?.setLoader(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header title={"Parent details"} showBack bgColor="transparent" />
        {route !== "parentAccount" && (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#B8B8B8",
              borderBottomColor: "#B8B8B8",
              borderBottomWidth: 1,
              backgroundColor: "#fff",
            }}
          >
            <Stepper currentStep={1} totalSteps={2} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View
              style={{ alignSelf: "center", paddingTop: moderateScale(32) }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#ddd",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {parentImg ? (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#ddd",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    resizeMode="contain"
                    source={getBase64Obj(parentImg)}
                  />
                ) : (
                  <User />
                )}
              </View>
              {/* Edit Icon */}
              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "#00ACC1",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                <Pencil />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignSelf: "center",
                paddingTop: moderateScale(32),
                paddingHorizontal: moderateScale(20),
              }}
            >
              <InputField
                label={"Parent Name*"}
                placeholderText={"Enter parent name"}
                value={parentName}
                onChange={setParentName}
              />
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  label={"About Parent*"}
                  placeholderText={"Enter description"}
                  multiline
                  value={description}
                  onChange={setDescription}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  maxLength={10}
                  keyboardType="phone-pad"
                  label={"Mobile number*"}
                  placeholderText={"Enter mobile number"}
                  value={mobileNumber}
                  onChange={setMobileNumber}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  label={"Email ID*"}
                  placeholderText={"Enter email id"}
                  value={emailId}
                  onChange={setEmailId}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  label={"Address*"}
                  placeholderText={"Enter your address"}
                  multiline
                  value={address}
                  onChange={setAddress}
                />
              </View>

              {/* <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  label={Strings.location}
                  placeholderText={Strings.enterLocation}
                  rightIcon={<Location stroke={THEMES.colors.darkGrey} />}
                    value={address}
                  onChange={setAddress}
                />
              </View> */}
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  maxLength={6}
                  keyboardType="phone-pad"
                  label={"ZIP/Postal code*"}
                  placeholderText={"Enter zip or postal code"}
                  value={pinCode}
                  onChange={setPincode}
                />
              </View>
              <View
                style={{
                  paddingTop: moderateScale(16),
                  paddingBottom: moderateScale(24),
                }}
              >
                <Button title="Next" onPress={() => onSubmit()} />
              </View>
            </View>
          </ScrollView>
          <UploadImageModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            handleSelectedImage={(image) => handleLogo(image)}
          />
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

export default ParentDetails;
