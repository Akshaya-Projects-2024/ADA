import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../components/Header";
import BadgeCheck from "../../assets/svg/badge.svg";
import ProfileImg from "../../assets/svg/profile.svg";
import RightArrow from "../../assets/svg/rightArrow.svg";
import PawPrint from "../../assets/svg/paw-print.svg";
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
import { moderateScale, s } from "react-native-size-matters";
import Activity from "../../assets/svg/activity.svg";
import { useSelector } from "react-redux";
import {
  validateParentProfile,
  validateServiceProfile,
} from "../../utils/userUtils";
import ProfileDummy from "../../assets/svg/user.svg";
import Toggle from "../../components/Toggle";
import { LoginModules } from "../../constants/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import { contextValue } from "../../components/Loader";
import { deleteAccountApi } from "../../redux-store/actions/auth";
import { resetNavigation } from "../../navigations/rootNavigationRef";
import { showToast } from "../../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


const deleteAccountMethod = () => {
  Alert.alert(
    "Delete Account",
    "Are you sure you want to delete your Account ??",
    [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Ok", onPress: () => handleDeleteAccount() },
    ],
    { cancelable: false }
  );
};

const logoutMethod = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout ??",
    [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Ok", onPress: () => handleLogout() },
    ],
    { cancelable: false }
  );
};

const handleDeleteAccount = async () => {
  try {
    contextValue.setLoader(true);
    let obj = {
      userId: await decryptService("userId"),
      userType: "parent",
    };
    let res = await deleteAccountApi(obj);
    if (res?.data?.status_code == 200) {
      handleLogout()
      resetNavigation("app");
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
  resetNavigation("app");
};

const ParentAccount = (props) => {
  const { guestUser, loggedInModule } = useSelector(({ register }) => register);
  const profile = useSelector((state) => state?.commonReducer);

  const renderItem = (
    bgColor,
    icon,
    title,
    addBottom,
    route,
    showPending = false
  ) => {
    const Icon = icon;
    return (
      <TouchableOpacity
        onPress={() => {
          if (route == "deleteAccount") {
            deleteAccountMethod();
          } else if (route == "logout") {
            logoutMethod();
          } else {
            props.navigation.navigate(route, { route: "parentAccount" });
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
      </TouchableOpacity>
    );
  };

  const onProviderClick = () => {
    const validProviderProfile = validateServiceProfile(profile);
    if (validProviderProfile?.flag) {
      props.navigation.navigate("auth", {
        screen: "home",
      });
    } else {
      props.navigation.navigate("auth", {
        screen: validProviderProfile?.navigateTo,
        params: { route: "myprofile" },
      });
    }
  };

  const switchProfile = () => {
    const validProviderProfile = validateServiceProfile(profile);
    if (validProviderProfile?.flag) {
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
    } else {
      props.navigation.navigate("auth", {
        screen: validProviderProfile?.navigateTo,
        params: { route: "myprofile" },
      });
    }
  };

  const profileStatus = useMemo(() => {
    const validParentProfile = validateParentProfile(profile);
    return validParentProfile?.flag;
  }, [profile]);

  return (
    <LinearGradient
      locations={[0, 0.5, 0.6]}
      colors={["#f7f2f2", "#f5e0e4", "#fff7f2"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          customIcon={
            <Toggle
              state={loggedInModule === LoginModules.provider}
              onPress={switchProfile}
            />
          }
          // showBack
          title={Strings.myAccount}
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
                {profile?.logindetails?.parentphoto ? (
                  <Image
                    style={styles.profile}
                    source={{
                      uri: profile?.logindetails?.parentphoto,
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
                <Text style={styles.nameText}>
                  {guestUser
                    ? Strings.guest
                    : profile?.parentProfie?.parentContact?.name}
                </Text>
                <Text style={styles.premiumMemberText}>
                  {guestUser ? Strings.guestUser : Strings.premiumMemmber}
                </Text>
              </View>
              <View style={styles.padding14}>
                <View style={styles.contentView}>
                  <MenuItem
                    bgColor={THEMES.colors.lightCyan}
                    icon={<ProfileImg />}
                    title={Strings.myProfile}
                    showPending={guestUser || !profileStatus}
                    onPress={() =>
                      props.navigation.navigate("parentDetails", {
                        route: "parentAccount",
                      })
                    }
                  />
                  <MenuItem
                    bgColor={THEMES.colors.zanah}
                    icon={<PawPrint />}
                    title={Strings.myPetProfile}
                    showPending={guestUser || !profileStatus}
                    onPress={() =>
                      props.navigation.navigate("petDetail", {
                        route: "parentAccount",
                      })
                    }
                  />
                  <MenuItem
                    bgColor={THEMES.colors.hawkesBlue}
                    icon={<Activity />}
                    title={"Activity tracker"}
                    showPending={false}
                    onPress={() =>
                      props.navigation.navigate("petDetail", {
                        route: "parentAccount",
                      })
                    }
                    addBottom={"addBottom"}
                  />
                </View>
              </View>

              <View style={styles.padding12}>
                <View style={styles.contentView}>
                  {renderItem(
                    THEMES.colors.sandyBeach,
                    <BottomOpenCheck stroke={THEMES.colors.california} />,
                    Strings.myBookings,
                    "",
                    "myBookings"
                  )}
                  {renderItem(
                    THEMES.colors.hawkesBlue,
                    <Star />,
                    "Reviews",
                    "",
                    "parentReviews"
                  )}
                  {renderItem(
                    THEMES.colors.peach,
                    <Logout />,
                    "Emergency Alert",
                    "addBottom",
                    "emergencyAlert"
                  )}
                </View>
              </View>
              {/* 
            <View style={styles.padding12}>
              <View style={styles.contentView}>
                {renderItem(
                  THEMES.colors.cornFlowerBlue,
                  <Badge />,
                  Strings.paymentSubScription,
                  "addBottom",
                  "paymentsSubscription"
                )}
              </View>
            </View> */}

              <View style={styles.padding12}>
                <View style={styles.contentView}>
                  <MenuItem
                    bgColor={THEMES.colors.cherub}
                    icon={<Users />}
                    title={"Register as a Service provider"}
                    showPending={false}
                    onPress={onProviderClick}
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
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    paddingTop: moderateScale(4),
  },
  nameText: {
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
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
export default ParentAccount;
