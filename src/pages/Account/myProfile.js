import React, { useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import RightArrow from "../../assets/svg/rightArrow.svg";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { validateCompleteServiceProfile } from "../../utils/userUtils";
import { SafeAreaView } from "react-native-safe-area-context";

const MyProfile = (props) => {
  const { guestUser } = useSelector(({ register }) => register);
  const profile = useSelector((state) => state?.commonReducer);

  const profileStatus = useMemo(() => {
    const validParentProfile = validateCompleteServiceProfile(profile);
    return validParentProfile;
  }, [profile]);

  const renderItem = (title, addBottom, route, description, showPending) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate(route, { route: "myprofile" })}
        style={[
          styles.flexRow,
          {
            paddingBottom: addBottom && moderateScale(16),
          },
        ]}
      >
        <View>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <View style={styles.flexRowContent}>
          {showPending && <Text style={styles.pendingText}>Pending</Text>}
          <RightArrow stroke={THEMES.colors.boulder} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header title={Strings.myProfile} showBack bgColor="transparent" />
        <View style={styles.padding32}>
          <View style={styles.cardView}>
            {renderItem(
              Strings.businessDetails,
              "",
              "businessDetail",
              Strings.businessDescription,
              guestUser ||
                (!profileStatus?.flag &&
                  profileStatus?.modules?.includes("businessDetail"))
            )}

            {renderItem(
              Strings.contactDetails,
              "",
              "contactDetails",
              Strings.contactDescription,
              guestUser ||
                (!profileStatus?.flag &&
                  profileStatus?.modules?.includes("contactDetails"))
            )}
            {renderItem(
              Strings.uploadImages,
              "",
              "uploadImagesDocs",
              Strings.uploadImagesDescription,
              guestUser ||
                (!profileStatus?.flag &&
                  profileStatus?.modules?.includes("uploadImagesDocs"))
            )}
            {renderItem(
              Strings.sessionDetails,
              "",
              "sessionDetail",
              Strings.sessionDescriptions,
              guestUser ||
                (!profileStatus?.flag &&
                  profileStatus?.modules?.includes("sessionDetail"))
            )}
            {renderItem(
              Strings.mediaLinks,
              "addBottom",
              "mediaLink",
              Strings.mediaDescription,
              guestUser ||
                (!profileStatus?.flag &&
                  profileStatus?.modules?.includes("mediaLink"))
            )}
          </View>
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
  padding32: {
    paddingTop: moderateScale(32),
    paddingHorizontal: moderateScale(20),
  },
  flexRowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardView: {
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
    lineHeight: moderateScale(23),
  },
  descriptionText: {
    fontSize: THEMES.fonts.font10,
    lineHeight: moderateScale(16),
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.darkGrey,
  },
  pendingText: {
    color: "#FF6437",
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.regular,
  },
});

export default MyProfile;
