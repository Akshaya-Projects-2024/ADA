import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../components/Header";
import BadgeCheck from "../../assets/svg/badge.svg";
import ProfileImg from "../../assets/svg/profile.svg";
import RightArrow from "../../assets/svg/rightArrow.svg";
import Badge from "../../assets/svg/badgeCheck.svg";
import BottomOpenCheck from "../../assets/svg/bookings.svg";
import Star from "../../assets/svg/star.svg";
import Users from "../../assets/svg/users.svg";
import Refresh from "../../assets/svg/refresh.svg";
import Document from "../../assets/svg/document.svg";
import Delete from "../../assets/svg/delete.svg";
import Logout from "../../assets/svg/logout.svg";
import ContactUs from "../../assets/svg/contactUs.svg";
import AboutUs from "../../assets/svg/aboutUs.svg";
import Strings from "../../constants/strings";
import { moderateScale } from "react-native-size-matters";
import {
  validateParentProfile,
  validateServiceProfile,
} from "../../utils/userUtils";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDummy from "../../assets/svg/user.svg";
import Toggle from "../../components/Toggle";
import { LoginModules } from "../../constants/enums";
import { decryptService } from "../../utils/storageFunc";
import { deleteAccountApi } from "../../redux-store/actions/auth";
import {
  navigateToParent,
  resetNavigation,
} from "../../navigations/rootNavigationRef";
import { showToast } from "../../utils/utils";
import { contextValue } from "../../components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HolidayMenuIcon from "../../assets/svg/HolidayMenuIcon";
import Dialog from "../../components/Dialog";
import { useUser } from "../../api/UserContext";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import { useFocusEffect } from "@react-navigation/native";
import { fetchUserProfileData } from "../../redux-store/actions/registerAction";

const MyAccount = (props) => {
  const { guestUser, loggedInModule } = useSelector(({ register }) => register);
  const profile = useSelector((state) => state?.commonReducer);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [loogutModal, setLogoutModal] = useState(false);
  const { userData } = useUser();
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchUserProfileData());
    }, [])
  );

  const profileServices = useMemo(
    () =>
      profile?.providerProfile?.providerBusiness?.services?.reduce(
        (accumulator, currentValue) =>
          accumulator + `${currentValue?.service} `,
        ""
      ),
    [profile?.providerProfile?.providerBusiness?.services]
  );

  const profileStatus = useMemo(() => {
    const validProviderProfile = validateServiceProfile(profile, false, true);
    return validProviderProfile;
  }, [profile]);

  const handleSwitch = () => {
    if (profile?.parentProfie?.parentContact?.id) {
      switchProfile();
    } else {
      setModal(true);
    }
  };

  const MenuItem = ({
    bgColor,
    icon,
    title,
    addBottom,
    showPending = false,
    onPress,
  }) => {
    const Icon = icon;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.flexRow,
          {
            paddingBottom: addBottom && moderateScale(16),
          },
        ]}
      >
        <View style={styles.rowCenter}>
          <View style={[styles.iconStyle, { backgroundColor: bgColor }]}>
            {Icon}
          </View>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showPending && <Text style={styles.pendingText}>Pending</Text>}
          <RightArrow stroke={THEMES.colors.boulder} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteAccountModal(false);
      contextValue.setLoader(true);
      let obj = {
        userId: await decryptService("userId"),
        userType: "provider",
      };
      let res = await deleteAccountApi(obj);
      if (res?.data?.status_code == 200) {
        setTimeout(() => {
          handleLogout();
          resetNavigation("app");
        }, 300);
      } else {
        showToast("Error", "Something went wrong!! Please try again later.");
      }
      contextValue.setLoader(false);
    } catch (error) {
      showToast("Error", "Something went wrong!! Please try again later.");
      contextValue.setLoader(false);
    }
  };

  const handleLogout = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    let filteredAsyncStorage = asyncStorageKeys;
    if (filteredAsyncStorage?.length > 0) {
      await AsyncStorage.multiRemove(filteredAsyncStorage);
    }
    setLogoutModal(false);
    resetNavigation("app");
  };

  const renderItem = (
    bgColor,
    icon,
    title,
    addBottom,
    route,
    showPending = false,
    checkPermission = false
  ) => {
    const Icon = icon;
    return (
      <TouchableButtonWithPermission
        customMsgForRegistration={
          "Get Registered and subscribe to enjoy all exciting features of ADA app."
        }
        checkPermission={checkPermission}
        onPress={() => {
          if (route == "deleteAccount") {
            setDeleteAccountModal(true);
          } else if (route == "logout") {
            setLogoutModal(true);
          } else {
            if (
              (userData?.providerProfile?.providerBusiness?.id !== 0 &&
                userData?.providerProfile?.providerContact?.id !== 0 &&
                userData?.providerProfile?.ProviderSession?.id !== 0 &&
                userData?.providerProfile?.sessionDetails?.length) ||
              title !== "My Profile"
            ) {
              props.navigation.navigate(route, { route: "myprofile" });
            } else {
              const validProviderProfile = validateServiceProfile(userData);
              props.navigation.navigate(validProviderProfile?.navigateTo);
            }
          }
        }}
        style={[
          styles.flexRow,

          {
            paddingBottom: addBottom && moderateScale(16),
          },
        ]}
      >
        <View style={styles.rowCenter}>
          <View style={[styles.iconStyle, { backgroundColor: bgColor }]}>
            {Icon}
          </View>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showPending && <Text style={styles.pendingText}>Pending</Text>}
          <RightArrow stroke={THEMES.colors.boulder} />
        </View>
      </TouchableButtonWithPermission>
    );
  };
  const onParentClick = () => {
    const validParentProfile = validateParentProfile(profile);
    if (validParentProfile?.flag) {
      navigateToParent("petParentAppStack", props.navigation);
    } else {
      props.navigation.navigate(validParentProfile?.navigateTo, {
        route: "myAccount",
      });
    }
  };

  const switchProfile = () => {
    const validParentProfile = validateParentProfile(profile);
    modal && setModal(false);
    if (validParentProfile?.flag) {
      navigateToParent("petParentAppStack", props.navigation);
    } else {
      // props.navigation.navigate(validParentProfile?.navigateTo, {
      //   route: "parentAccount",
      //   redirectFunc: () =>
      //     navigateToParent("petParentAppStack", props.navigation),
      // });
      props.navigation.navigate(validParentProfile?.navigateTo, {
        route: "myAccount",
      });
    }
  };

  return (
    <LinearGradient
      locations={[0, 0.5, 0.6]}
      colors={[
        THEMES.colors.iceBerg,
        THEMES.colors.panache,
        THEMES.colors.bgColor,
      ]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* <StatusBar backgroundColor={THEMES.colors.lightCyan} /> */}
        <Header
          customIcon={
            <Toggle
              state={loggedInModule === LoginModules.provider}
              onPress={handleSwitch}
            />
          }
          // showBack
          title={Strings.myAccount}
          // showSearch
          bgColor="transparent"
        />
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle={"dark-content"}
        />
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <View>
              <View style={styles.profileView}>
                {profile?.providerProfile?.providerDocument?.[0]?.url ? (
                  <Image
                    resizeMode="contain"
                    style={styles.profile}
                    source={{
                      uri: profile?.providerProfile?.providerDocument?.[0]?.url,
                    }}
                  />
                ) : (
                  <View
                    style={[
                      styles.profile,
                      {
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <ProfileDummy width={40} />
                  </View>
                )}
              </View>
              <View style={styles.badgeView}>
                <BadgeCheck />
              </View>
              <View style={styles.nameView}>
                <Text style={[styles.nameText]}>
                  {guestUser
                    ? Strings.guest
                    : profile?.providerProfile?.providerBusiness?.name}
                </Text>
                <View style={{ alignItems: "center", width: "80%" }}>
                  {profileServices ? (
                    <Text
                      numberOfLines={2}
                      style={[styles.roleText, { textAlign: "center" }]}
                    >
                      {profileServices}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.padding14}>
                <View style={styles.contentView}>
                  {renderItem(
                    THEMES.colors.lightCyan,
                    <ProfileImg />,
                    Strings.myProfile,
                    "",
                    "myProfile",
                    !profileStatus?.flag
                  )}
                  {renderItem(
                    THEMES.colors.cornFlowerBlue,
                    <Badge />,
                    Strings.paymentSubScription,
                    "",
                    "paymentsSubscription",
                    profile?.providerProfile?.subscription?.status !== "active"
                  )}
                  {renderItem(
                    THEMES.colors.sandyBeach,
                    <BottomOpenCheck stroke={THEMES.colors.california} />,
                    Strings.myBookings,
                    "",
                    "myBookings",
                    false,
                    true
                  )}
                  {renderItem(
                    THEMES.colors.sandyBeach,
                    <HolidayMenuIcon />,
                    Strings.markHoliday,
                    "",
                    "markHoliday",
                    false,
                    true
                  )}
                  {renderItem(
                    THEMES.colors.hawkesBlue,
                    <Star />,
                    Strings.clientReviews,
                    "addBottom",
                    "clientReview",
                    false,
                    true
                  )}
                </View>
              </View>
              <View style={styles.padding12}>
                <View style={styles.contentView}>
                  <MenuItem
                    bgColor={THEMES.colors.cherub}
                    icon={<Users />}
                    title={Strings.registerAsParent}
                    showPending={false}
                    onPress={onParentClick}
                    addBottom={"addBottom"}
                  />
                </View>
              </View>

              <View style={styles.padding12}>
                <View style={styles.contentView}>
                  {renderItem(
                    THEMES.colors.gallery,
                    <Refresh />,
                    Strings.refundCancellationPolicy,
                    "",
                    "commonScreen"
                  )}

                  {renderItem(
                    THEMES.colors.zanah,
                    <Document />,
                    Strings.privacyPolicy,
                    "addbottom",
                    "commonScreen"
                  )}
                </View>
              </View>

              <View style={styles.padding12}>
                <View style={styles.contentView}>
                  {renderItem(
                    THEMES.colors.hawkesBlue,
                    <ContactUs />,
                    Strings.contactUs,
                    "",
                    "contactPage"
                  )}
                  {renderItem(
                    THEMES.colors.wispPink,
                    <AboutUs />,
                    Strings.aboutUs,
                    "addBottom",
                    "commonScreen"
                  )}
                </View>
              </View>

              <View style={styles.padding12}>
                <View style={styles.contentView}>
                  {renderItem(
                    THEMES.colors.cosmos,
                    <Delete />,
                    Strings.deleteAccount,
                    "",
                    "deleteAccount"
                  )}
                  {renderItem(
                    THEMES.colors.peach,
                    <Logout />,
                    Strings.logout,
                    "addBottom",
                    "logout"
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <Dialog
          title={"Delete Account"}
          flag={deleteAccountModal}
          description={Strings.deleteAcccount}
          leftButtonText="No"
          rightButtonText="Yes"
          leftButtonPressed={() => setDeleteAccountModal(false)}
          rightButtonPressed={handleDeleteAccount}
          onClose={() => setDeleteAccountModal(false)}
        />

        <Dialog
          title={"Logout Account"}
          flag={loogutModal}
          description={Strings.logoutAccount}
          leftButtonText="No"
          rightButtonText="Yes"
          leftButtonPressed={() => setLogoutModal(false)}
          rightButtonPressed={handleLogout}
          onClose={() => setLogoutModal(false)}
        />
        <Dialog
          flag={modal}
          title={"Info"}
          description={"Do you want to register as Pet Parent?"}
          rightButtonText="Yes"
          leftButtonText="Close"
          leftButtonPressed={() => setModal(false)}
          rightButtonPressed={switchProfile}
          onClose={() => {
            setModal(false);
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScale(20),
  },
  badgeView: {
    position: "absolute",
    width: 100,
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "center",
    top: moderateScale(8),
  },
  profileView: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 1,
    borderColor: "transparent",
    alignSelf: "center",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  padding14: {
    paddingTop: moderateScale(14),
    marginHorizontal: moderateScale(20),
  },
  padding12: {
    paddingTop: moderateScale(12),
    marginHorizontal: moderateScale(20),
  },
  contentView: {
    backgroundColor: THEMES.colors.white,
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: THEMES.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: THEMES.colors.white,
  },
  premiumMemberText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.outrageousOrange,
    fontFamily: THEMES.fontFamily.semiBold,
    paddingTop: moderateScale(4),
  },
  roleText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    paddingTop: moderateScale(4),
    paddingBottom: moderateScale(10),
  },
  nameText: {
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    width: "80%",
    textAlign: "center",
  },
  nameView: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: moderateScale(15),
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: moderateScale(16),
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: THEMES.colors.bgColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  titleText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  pendingText: {
    color: THEMES.colors.outrageousOrange,
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.regular,
  },
});
export default MyAccount;
