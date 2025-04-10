import React, { useEffect, useState } from "react";
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
import ShareImg from "../../assets/svg/share.svg";
import Share from "react-native-share";
import { shareAdoption } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { contextValue } from "../../components/Loader";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import BackArrowComponent from "../../components/BackArrowComponent";
import RightArrow from "../../assets/svg/arrowRight.svg";

const MedicalAlertDetail = (props) => {
  const selectedAdotpionData = props.route.params.selectedData;
  const [image, setImage] = useState();
  const profilePhoto = selectedAdotpionData?.petdetails?.documents?.find(
    (doc) => doc.documenttype == "profilePhoto"
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: profilePhoto?.url }}
          resizeMode="cover"
          style={styles.imgBackground}
        >
          <BackArrowComponent />
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
                    {selectedAdotpionData?.name
                      ? selectedAdotpionData?.name
                      : "Unknown Pet"}
                  </Text>
                  <Text numberOfLines={1} style={styles.breedType}>
                    {selectedAdotpionData?.petdetails?.breed}
                  </Text>
                </View>
                <View style={styles.dogDetailView}>
                  <View
                    style={{
                      position: "relative",
                      width: moderateScale(75),
                      height: moderateScale(75),
                    }}
                  >
                    <Image
                      source={require("../../assets/images/dogType.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.dogText}>
                        {" "}
                        {selectedAdotpionData?.petdetails?.type
                          ? selectedAdotpionData?.petdetails?.type
                          : "--"}
                      </Text>
                      <Text style={styles.type}>Type</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      position: "relative",
                      width: moderateScale(75),
                      height: moderateScale(75),
                    }}
                  >
                    <Image
                      source={require("../../assets/images/ageType.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.ageText}>
                        {selectedAdotpionData?.petdetails?.age
                          ? selectedAdotpionData?.petdetails?.age
                          : "--"}
                      </Text>
                      <Text style={styles.age}>Age</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      position: "relative",
                      width: moderateScale(75),
                      height: moderateScale(75),
                    }}
                  >
                    <Image
                      source={require("../../assets/images/genderType.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.genderText}>
                        {selectedAdotpionData?.gender
                          ? selectedAdotpionData?.gender
                          : "--"}
                      </Text>
                      <Text style={styles.gender}>Gender</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      position: "relative",
                      width: moderateScale(75),
                      height: moderateScale(75),
                    }}
                  >
                    <Image
                      source={require("../../assets/images/weightType.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.weightText}>
                        {selectedAdotpionData?.petdetails?.weight
                          ? selectedAdotpionData?.petdetails?.weight
                          : "--"}
                      </Text>
                      <Text style={styles.weight}>Weight</Text>
                    </View>
                  </View>
                </View>

                <View>
                  <View
                    style={
                      selectedAdotpionData?.description
                        ? styles.locationMain
                        : styles.padding0
                    }
                  >
                    <Text style={styles.lastSeenText}>Help description </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.location,
                        {
                          paddingTop: moderateScale(5),
                          marginBottom: moderateScale(20),
                        },
                      ]}
                    >
                      {selectedAdotpionData?.features}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{width:'45%'}}>
                      <Text style={styles.lastSeenText}>
                        Help needed date :{" "}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.location,
                          {
                            paddingTop: moderateScale(5),
                            marginBottom: moderateScale(20),
                          },
                        ]}
                      >
                        {selectedAdotpionData?.lastseen}
                      </Text>
                    </View>

                    <View style={{width:'45%'}}>
                      <Text style={styles.lastSeenText}>Location : </Text>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.location,
                          {
                            paddingTop: moderateScale(5),
                            marginBottom: moderateScale(20),
                          },
                        ]}
                      >
                        {selectedAdotpionData?.lastseenlocation}
                      </Text>
                    </View>
                  </View>

              

                 

                  <View style={styles.cardView}>
                    <View style={styles.imgView}>
                      {selectedAdotpionData?.parentphoto ? (
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
                        Contact Details :
                      </Text>
                      <Text numberOfLines={2} style={styles.parentNameLocation}>
                        {selectedAdotpionData?.postedby}
                      </Text>
                      <View style={styles.rowDetail}>
                        <Text style={styles.mobileNoText}>
                          {selectedAdotpionData?.contactnum}
                        </Text>
                        <TouchableOpacity
                          style={{
                            marginHorizontal: moderateScale(10),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onPress={() =>
                            Linking.openURL(
                              `tel:${selectedAdotpionData?.contactnum}`
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
    width: "45%",
    fontSize: THEMES.fonts.font14,
    textAlign: "right",
    color: THEMES.colors.darkGrey,
    marginRight: 5,
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
    fontFamily: THEMES.fontFamily.medium,
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
    marginTop: moderateScale(10),
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
  goBackBtn: {
    paddingTop: moderateScale(18),
    paddingHorizontal: moderateScale(15),
  },
});
export default MedicalAlertDetail;
