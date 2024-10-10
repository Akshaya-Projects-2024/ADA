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
import Msg from "../../assets/svg/msgSquareText.svg";
import Call from "../../assets/svg/phoneCall.svg";
import RightArrow from "../../assets/svg/arrowRight.svg";
import More from "../../assets/svg/more.svg";

const Data = ["Vaccinations", "Document 1", "Document 2", "Document 3"];

const AppointmentDetail = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/dogBackground.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <TouchableOpacity
          style={styles.goBackBtn}
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
            <View style={styles.mainContent}>
              <View style={styles.flexRow}>
                <Text numberOfLines={1} style={styles.petName}>
                  Rockey
                </Text>
                <Text numberOfLines={1} style={styles.breedType}>
                  German Shepard
                </Text>
              </View>
              <View style={styles.content}>
                <View style={styles.boxView}>
                  <Text style={styles.dogText}>Dog</Text>
                  <Text style={styles.type}>Type</Text>
                </View>
                <View style={styles.ageContent}>
                  <Text style={styles.ageText}>1 Y 8 M</Text>
                  <Text style={styles.age}>Age</Text>
                </View>
                <View style={styles.genderContent}>
                  <Text style={styles.genderText}>Male</Text>
                  <Text style={styles.gender}>Gender</Text>
                </View>
                <View style={styles.weightContent}>
                  <Text style={styles.weightText}>50kg</Text>
                  <Text style={styles.weight}>Weight</Text>
                </View>
              </View>

              <View>
                <Text style={styles.aboutPetText}>About Pet:</Text>
                <Text style={styles.petDescription}>
                  Hi ,I am Rocky. I likes to chew cucumber, Mutter and cuddles
                  from my dad. I am mischievous but very friendly dog. 
                </Text>
                <View style={styles.medicalDocView}>
                  <Text style={styles.medicalText}>Medical documents</Text>
                  <RightArrow stroke="#000" />
                </View>

                <View style={styles.documentView}>
                  <ScrollView
                    horizontal={true}
                    style={{ flex: 1 }}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  >
                    {Data.map((item, index) => {
                      return (
                        <View
                          style={[
                            styles.documents,
                            { marginLeft: index === 0 ? 0 : moderateScale(10) },
                          ]}
                        >
                          <Text style={styles.docText}>{item}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
                <View style={styles.moreView}>
                  <More />
                </View>

                <View style={styles.cardView}>
                  <View style={styles.imgView}>
                    <Image
                      source={require("../../assets/images/dogImg.png")}
                      style={styles.img}
                    />
                  </View>
                  <View style={styles.parentDetailsView}>
                    <Text style={styles.parentText}>Pet parent details</Text>
                    <Text numberOfLines={2} style={styles.location}>
                      Mr. Mickey Hawkins - Mumbai
                    </Text>
                    <View style={styles.rowDetail}>
                      <Text style={styles.numberText}>987654321</Text>
                      <View style={styles.ml20}>
                        <Msg />
                      </View>

                      <View style={styles.ml20}>
                        <Call />
                      </View>
                    </View>
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
  mainContent: {
    paddingVertical: moderateScale(5),
    paddingBottom: moderateScale(30),
    backgroundColor: THEMES.colors.bgColor,
  },
  flexRow: {
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
  content: {
    paddingVertical: moderateScale(32),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxView: {
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
  ageContent: {
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
  genderContent: {
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
  weightContent: {
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
  aboutPetText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
  },
  petDescription: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(5),
    lineHeight: moderateScale(18),
  },
  medicalDocView: {
    flexDirection: "row",
    paddingTop: moderateScale(24),
    alignItems: "center",
  },
  medicalText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
    paddingRight: moderateScale(8),
  },
  documentView: {
    flexDirection: "row",
    paddingTop: moderateScale(18),
  },
  documents: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    backgroundColor: "#d6f2f5",
  },
  docText: {
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font12,
  },
  moreView: {
    paddingTop: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
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
  parentDetailsView: {
    width: "80%",
    marginLeft: moderateScale(11),
  },
  parentText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font10,
  },
  location: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.bold,
    fontSize: THEMES.fonts.font14,
    paddingTop: moderateScale(3),
  },
  rowDetail: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: moderateScale(5),
  },
  numberText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
  },
  ml20: {
    marginLeft: moderateScale(20),
  },
  goBackBtn: {
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(15),
  },
});

export default AppointmentDetail;
