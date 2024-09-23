import React from "react";
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
import SwitchIcon from "../../assets/svg/switch.svg";
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
import Strings from "../../utils/strings";
import { moderateScale, s } from "react-native-size-matters";

const MyAccount = (props) => {
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
        onPress={() => props.navigation.navigate(route)}
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
      <StatusBar backgroundColor={THEMES.colors.lightCyan} />
      <Header
        customIcon={<SwitchIcon />}
        title={Strings.myAccount}
        showSearch
        bgColor="transparent"
        onSearchPress={() => props.navigation.navigate("search")}
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
              <Image
                style={styles.profile}
                source={require("../../assets/images/profileImg.png")}
              />
            </View>
            <View style={styles.badgeView}>
              <BadgeCheck />
            </View>
            <View style={styles.nameView}>
              <Text style={styles.nameText}>KET</Text>
              <Text style={styles.roleText}>Pet Trainer</Text>
              <Text style={styles.premiumMemberText}>
                {Strings.premiumMemmber}
              </Text>
            </View>
            <View style={styles.padding14}>
              <View style={styles.contentView}>
                {renderItem(
                  THEMES.colors.lightCyan,
                  <ProfileImg />,
                  Strings.myProfile,
                  "",
                  "myProfile",
                  true
                )}
                {renderItem(
                  THEMES.colors.cornFlowerBlue,
                  <Badge />,
                  Strings.paymentSubScription,
                  "",
                  "paymentsSubscription"
                )}
                {renderItem(
                  THEMES.colors.sandyBeach,
                  <BottomOpenCheck stroke={THEMES.colors.california} />,
                  Strings.myBookings
                )}
                {renderItem(
                  THEMES.colors.sandyBeach,
                  <BottomOpenCheck stroke={THEMES.colors.california} />,
                  Strings.markHoliday,
                  "",
                  "markHoliday"
                )}
                {renderItem(
                  THEMES.colors.hawkesBlue,
                  <Star />,
                  Strings.clientReviews,
                  "addBottom",
                  "clientReview"
                )}
              </View>
            </View>
            <View style={styles.padding12}>
              <View style={styles.contentView}>
                {renderItem(
                  THEMES.colors.cherub,
                  <Users />,
                  Strings.registerAsParent,
                  "addBottom"
                )}
              </View>
            </View>

            <View style={styles.padding12}>
              <View style={styles.contentView}>
                {renderItem(
                  THEMES.colors.gallery,
                  <Refresh />,
                  Strings.refundCancellationPolicy
                )}
                {renderItem(
                  THEMES.colors.zanah,
                  <Document />,
                  Strings.privacyPolicy,
                  "addbottom"
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
                  "contactDetails"
                )}
                {renderItem(
                  THEMES.colors.wispPink,
                  <AboutUs />,
                  Strings.aboutUs,
                  "addBottom"
                )}
              </View>
            </View>

            <View style={styles.padding12}>
              <View style={styles.contentView}>
                {renderItem(
                  THEMES.colors.cosmos,
                  <Delete />,
                  Strings.deleteAccount
                )}
                {renderItem(
                  THEMES.colors.peach,
                  <Logout />,
                  Strings.logout,
                  "addBottom"
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
export default MyAccount;
