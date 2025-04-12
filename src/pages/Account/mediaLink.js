import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from "react-native";
import InputField from "../../components/InputField";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import ClipboardPaste from "../../assets/svg/clipboardPaste.svg";
import Strings from "../../constants/strings";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import Stepper from "../../components/Stepper";
import { saveMediaLinks } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import Dialog from "../../components/Dialog";
import { useUser } from "../../api/UserContext";
import { contextValue } from "../../components/Loader";

// Add these imports at the top
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

const MediaLink = (props) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const route = props?.route?.params?.route;
  const [modal, setModal] = useState(false);
  const [link, setLink] = useState();
  const [instaLink, setInstaLink] = useState();
  const [fbLink, setFbLink] = useState();
  const [weblink, setWebLink] = useState();
  const { providerProfile } = useSelector((state) => state?.commonReducer);
  const { MediaLinks } = providerProfile;
  const { userData, apiInitCall } = useUser();
  // Add these state variables after other states
  const [isSubmit, setIsSubmit] = useState(false);
  const [editModal, setEditModal] = useState(false);

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
    if (MediaLinks?.facebook) {
      isPresent = true;
      setFbLink(MediaLinks?.facebook);
    }
    if (MediaLinks?.instagram) {
      isPresent = true;
      setInstaLink(MediaLinks?.instagram);
    }
    if (MediaLinks?.onlinelink) {
      isPresent = true;
      setWebLink(MediaLinks?.onlinelink);
    }
    if (MediaLinks?.website) {
      isPresent = true;
      setLink(MediaLinks?.website);
    }
    if (!userData?.providerProfile?.MediaLinks?.id) {
      setIsSubmit(true);
    }
  };

  const onSubmit = async () => {
    try {
      contextValue?.setLoader(true);
      const userId = await decryptService("userId");
      const postData = {
        userid: userId,
        onlinelink: link,
        instagram: instaLink,
        facebook: fbLink,
        website: weblink,
        ...(MediaLinks?.id ? { id: MediaLinks?.id } : {}),
      };
      const res = await saveMediaLinks(postData);
      if (res?.status == 200) {
        if (
          !Boolean(+userData?.providerProfile?.MediaLinks?.id) &&
          userData?.logindetails?.providerstatus === "AAPPROVALPENDING"
        ) {
          setModal(true);
        } else {
          handleNavigation();
        }
      } else {
        showToast("error", res?.data?.message);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      console.log("error", error);
      showToast("error", "Something went wrong!!!");
    }
    apiInitCall();
  };

  const handleNavigation = () => {
    if (route === "myprofile") {
      props.navigation.dispatch(StackActions.pop(1));
    } else {
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
    }
  };

  // Add edit popup function before return statement
  const editPopup = () => {
    setEditModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={Strings.mediaLinks}
          showBack
          bgColor="transparent"
          right={
            route === "myprofile" &&
            userData?.providerProfile?.MediaLinks?.id ? (
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 5,
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
            <Stepper currentStep={6} totalSteps={6} />
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
              <View
                style={[
                  styles.headerView,
                  { paddingTop: route !== "myprofile" ? 18 : 30 },
                ]}
              >
                <Text style={styles.headerText}>
                  {Strings.onlineConsultation}
                </Text>
              </View>

              <View style={styles.contentView}>
                <View style={styles.w20}>
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/addLink.png")}
                  />
                </View>
                <View style={styles.w80}>
                  <InputField
                    label={Strings.addLink}
                    placeholderText={Strings.pasteLink}
                    rightIcon={
                      <ClipboardPaste stroke={THEMES.colors.darkGrey} />
                    }
                    value={link}
                    onChange={setLink}
                  />
                </View>
              </View>

              <View style={styles.secondContentHeading}>
                <Text style={styles.secondContent}>
                  {Strings.socialMediaLink}
                </Text>
              </View>

              <View style={styles.secondImgView}>
                <View style={styles.w20}>
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/instagram.png")}
                  />
                </View>
                <View style={styles.w80}>
                  <InputField
                    label={Strings.instaLink}
                    placeholderText={Strings.pasteLink}
                    rightIcon={<ClipboardPaste stroke={THEMES.colors.red} />}
                    value={instaLink}
                    onChange={setInstaLink}
                  />
                </View>
              </View>

              <View style={styles.secondaryContentView}>
                <View style={styles.w20}>
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/facebook.png")}
                  />
                </View>
                <View style={styles.w80}>
                  <InputField
                    label={Strings.fbLink}
                    placeholderText={Strings.pasteLink}
                    rightIcon={
                      <ClipboardPaste stroke={THEMES.colors.darkGrey} />
                    }
                    value={fbLink}
                    onChange={setFbLink}
                  />
                </View>
              </View>

              <View style={styles.secondaryContentView}>
                <View style={styles.w20}>
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/websiteLink.png")}
                  />
                </View>
                <View style={styles.w80}>
                  <InputField
                    label={Strings.websiteLink}
                    placeholderText={Strings.pasteLink}
                    rightIcon={
                      <ClipboardPaste stroke={THEMES.colors.darkGrey} />
                    }
                    value={weblink}
                    onChange={setWebLink}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          {!isKeyboardVisible && isSubmit && (
            <View style={styles.submitButton}>
              <Button title={Strings.submit} onPress={() => onSubmit()} />
            </View>
          )}
        </View>

        <Dialog
          flag={editModal}
          description={"Are you sure you want to edit these media links?"}
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
          title="Edit Media Links"
        />
        <Dialog
          flag={modal}
          title={"Registration Complete! 🎉"}
          description={
            "Thank you for registering on ADA. Your profile will be validated and activated within 48 hours. Happy exploring!"
          }
          rightButtonText="Close"
          rightButtonPressed={() => {
            setModal(false);
            handleNavigation();
          }}
          onClose={() => {
            setModal(false);
            handleNavigation();
          }}
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
  headerView: {
    paddingHorizontal: moderateScale(16),
  },
  headerText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  contentView: {
    paddingTop: moderateScale(40),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
  },
  w20: {
    width: "20%",
  },
  w80: {
    width: "80%",
  },
  secondContentHeading: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(63),
  },
  secondContent: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  secondImgView: {
    paddingTop: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
  },
  secondaryContentView: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
  },
  submitButton: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(22),
  },
});

export default MediaLink;
