import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import Back from "../../assets/svg/back.svg";

const LostDogAlert = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/dogBackground.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <TouchableOpacity
          style={styles.mainView}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => props.navigation.goBack()}
        >
           <Back stroke="#000"/>
        </TouchableOpacity>
        <View style={styles.contentView}>
          <ScrollView
            style={{ flex: 1 }}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.contentRow}>
                <Text numberOfLines={1} style={styles.petName}>
                  Sheru
                </Text>
                <Text numberOfLines={1} style={styles.breedType}>
                  German Shepard
                </Text>
              </View>
              <View style={styles.dogDetailView}>
                <View style={styles.dogView}>
                  <Text style={styles.dogText}>Dog</Text>
                  <Text style={styles.type}>Type</Text>
                </View>
                <View style={styles.ageView}>
                  <Text style={styles.ageText}>1 Y 8 M</Text>
                  <Text style={styles.age}>Age</Text>
                </View>
                <View style={styles.genderView}>
                  <Text style={styles.genderText}>Male</Text>
                  <Text style={styles.gender}>Gender</Text>
                </View>
                <View style={styles.weightView}>
                  <Text style={styles.weightText}>50kg</Text>
                  <Text style={styles.weight}>Weight</Text>
                </View>
              </View>

              <View>
                <Text style={styles.featureTitle}>Help Description:</Text>
                <Text style={styles.descriptionText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. 
                </Text>
                <View style={styles.locationMain}>
                  <Text style={styles.lastSeenText}>Help location:</Text>
                  <Text numberOfLines={2} style={styles.location}>
                    J B Nagar, Andheri
                  </Text>
                </View>

                <View style={styles.cardView}>
                  <View style={styles.imgView}>
                    <Image
                      source={require("../../assets/images/dogImg.png")}
                      style={styles.img}
                    />
                  </View>
                  <View style={styles.w80}>
                    <Text style={styles.parentDetailText}>
                      Pet parent details
                    </Text>
                    <Text numberOfLines={2} style={styles.parentNameLocation}>
                      Mr. Mickey Hawkins - Mumbai
                    </Text>
                    <Text style={styles.mobileNoText}>987654321</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  imgBackground: {
    flex: 1,

    height: 288,
  },
  contentView: {
    backgroundColor: THEMES.colors.bgColor,
    alignItems: "flex-start",
    alignSelf: "flex-end",
    paddingHorizontal: moderateScale(17),
    width: "100%",
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    flex: 1,
    marginTop: moderateScale(200),
    paddingTop: moderateScale(38),
  },
  mainView: {
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(15),
  },
  content: {
    paddingVertical: moderateScale(5),
    paddingBottom: moderateScale(30),
    backgroundColor: THEMES.colors.bgColor,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  petName: {
    fontFamily: THEMES.fontFamily.bold,
    width: "50%",
    fontSize: THEMES.fonts.font16,
    color: THEMES.colors.black,
  },
  breedType: {
    fontFamily: THEMES.fontFamily.regular,
    width: "50%",
    fontSize: THEMES.fonts.font14,
    textAlign: "right",
    color: THEMES.colors.darkGrey,
  },
  dogDetailView: {
    paddingVertical: moderateScale(32),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dogView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#fee6e4",
    paddingVertical: moderateScale(16),
  },
  dogText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(23),
  },
  type: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(21),
  },
  ageView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#efeaec",
    paddingVertical: moderateScale(16),
  },
  ageText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(14),
  },
  age: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(23),
  },
  genderView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#fdf4d7",
    paddingVertical: moderateScale(16),
  },
  genderText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(21),
  },
  gender: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(14),
  },
  weightView: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "transparent",
    backgroundColor: "#fcd7d4",
    paddingVertical: moderateScale(16),
  },
  weightText: {
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingHorizontal: moderateScale(21),
  },
  weight: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.black,
    textAlign: "center",
    paddingTop: moderateScale(3),
    paddingHorizontal: moderateScale(14),
  },
  featureTitle: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
  },
  descriptionText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(5),
    lineHeight: moderateScale(18),
  },
  locationMain: {
    paddingTop: moderateScale(24),
  },
  lastSeenText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(5),
    lineHeight: moderateScale(18),
  },
  location: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(2),
    lineHeight: moderateScale(18),
  },

  cardView: {
    marginTop: moderateScale(32),
    padding: moderateScale(14),
    backgroundColor: THEMES.colors.white,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: THEMES.colors.lightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  imgView: {
    width: 51,
    height: 51,
    borderRadius: 51 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  img: {
    width: 51,
    height: 51,
    borderRadius: 51 / 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  w80: {
    width: "80%",
    marginLeft: moderateScale(11),
  },
  parentDetailText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
  },
  parentNameLocation: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    paddingTop: moderateScale(2),
  },
  mobileNoText: {
    color: THEMES.colors.blue,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(4),
  },
});
export default LostDogAlert;
