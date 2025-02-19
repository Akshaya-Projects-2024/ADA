import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import { ScrollView } from "react-native-gesture-handler";
import Back from "../../assets/svg/back.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileDummy from "../../assets/svg/user.svg";
import Call from "../../assets/svg/phoneCall.svg";

const AdoptionDetail = (props) => {
  const selectedAdotpionData = props.route.params.selectedData;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: selectedAdotpionData?.document?.url }}
          resizeMode="cover"
          style={styles.imgBackground}
        >
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
                    {selectedAdotpionData?.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.breedType}>
                    {selectedAdotpionData?.breed}
                  </Text>
                </View>
                <View style={styles.dogDetailView}>
                  <View style={styles.dogView}>
                    <Text style={styles.dogText}>
                      {" "}
                      {selectedAdotpionData?.category}
                    </Text>
                    <Text style={styles.type}>Type</Text>
                  </View>
                  <View style={styles.ageView}>
                    <Text style={styles.ageText}>
                      {selectedAdotpionData?.age}
                    </Text>
                    <Text style={styles.age}>Age</Text>
                  </View>
                  <View style={styles.genderView}>
                    <Text style={styles.genderText}>
                      {selectedAdotpionData?.gender}
                    </Text>
                    <Text style={styles.gender}>Gender</Text>
                  </View>
                  <View style={styles.weightView}>
                    <Text style={styles.weightText}>
                      {selectedAdotpionData?.weight}
                    </Text>
                    <Text style={styles.weight}>Weight</Text>
                  </View>
                </View>

                <View>
                  {selectedAdotpionData?.description && (
                    <>
                      <Text style={styles.featureTitle}>About the pet</Text>
                      <Text style={styles.descriptionText}>
                        {selectedAdotpionData?.description}
                      </Text>
                    </>
                  )}

                  <View
                    style={
                      selectedAdotpionData?.description
                        ? styles.locationMain
                        : styles.padding0
                    }
                  >
                    <Text style={styles.lastSeenText}>
                      Reason for Adoption{" "}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.location,
                        { paddingTop: moderateScale(5) },
                      ]}
                    >
                      {selectedAdotpionData?.reason}
                    </Text>
                  </View>

                  <View style={styles.cardView}>
                    <View style={styles.imgView}>
                      {!selectedAdotpionData?.parentphoto ? (
                        <Image
                          source={{ uri: selectedAdotpionData?.parentphoto }}
                          style={styles.img}
                        />
                      ) : (
                        <View
                          style={{
                            borderWidth: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: 48 / 2,
                          }}
                        >
                          <ProfileDummy width={30} />
                        </View>
                      )}
                    </View>
                    <View style={styles.w80}>
                      <Text style={styles.parentDetailText}>
                        Pet parent details
                      </Text>
                      <Text numberOfLines={2} style={styles.parentNameLocation}>
                        {selectedAdotpionData?.parentname} -{" "}
                        {selectedAdotpionData?.parentlocation}
                      </Text>
                      <View style={styles.rowDetail}>
                      <Text style={styles.mobileNoText}>
                        {selectedAdotpionData?.contactnumber}
                      </Text>
                      <TouchableOpacity
                        style={{marginHorizontal:moderateScale(10)}}
                          onPress={() =>
                            Linking.openURL(
                              `tel:${selectedAdotpionData?.contactnumber}`
                            )
                          }
                        >
                          <Call />
                        </TouchableOpacity>
                        </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
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
    marginTop: moderateScale(230),
    paddingTop: moderateScale(25),
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
    paddingTop: moderateScale(32),
  },
  padding0: {
    paddingTop: moderateScale(0),
  },
  lastSeenText: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
  },
  location: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(5),
  },
  w40: {
    width: "40%",
    alignItems: "flex-start",
  },
  lastSeenDate: {
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(5),
    lineHeight: moderateScale(18),
  },
  lastDate: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(2),
    lineHeight: moderateScale(18),
  },
  petDescription: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.regular,
    fontSize: THEMES.fonts.font12,
    paddingTop: moderateScale(24),
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
  },
  rowDetail: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: moderateScale(5),
  },
});
export default AdoptionDetail;
