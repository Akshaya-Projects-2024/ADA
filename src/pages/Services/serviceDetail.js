import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import { goBack } from "../../navigations/rootNavigationRef";
import Back from "../../assets/svg/back.svg";
import Share from "../../assets/svg/share.svg";
import Bookmark from "../../assets/svg/bookmark.svg";
import RightArrow from "../../assets/svg/arrowRight.svg";
import Button from "../../components/Button";
import { getBase64Obj } from "../../utils/documentUtils";
import { validArray } from "../../utils/utils";

const Data = ["Vaccinations", "Document 1", "Document 2", "Document 3"];

const ServiceDetail = ({ navigation, route }) => {
  const selectedProvider = route?.params?.selectedProvider;
  console.log(
    "🚀 ~ ServiceDetail ~ selectedProvider:",
    selectedProvider?.profile?.providerRating
  );
  const selectedService = route?.params?.selectedService;
  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <StatusBar backgroundColor={THEMES.colors.white} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: moderateScale(20),
          paddingHorizontal: moderateScale(20),
          paddingBottom: moderateScale(15),
        }}
      >
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => goBack()}
        >
          <Back stroke={"#000"} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Bookmark />
          <View style={{ marginLeft: moderateScale(20) }}>
            <Share />
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: moderateScale(30),
          }}
        >
          <View
            style={{
              backgroundColor: "#D9D9D9",
              height: 105,
              width: 97,
              borderRadius: 12,
            }}
          >
            <Image
              style={{
                width: 55,
                height: 55,
                borderRadius: 55 / 2,
              }}
              source={getBase64Obj(selectedProvider?.photo)}
            />
          </View>
          <View style={{ paddingLeft: moderateScale(19), width: "80%" }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font16,
                color: THEMES.colors.black,
              }}
            >
              {selectedProvider?.profile?.providerBusiness?.name}
            </Text>
            {/* <Text
              numberOfLines={1}
              style={{
                fontFamily: THEMES.fontFamily.medium,
                paddingTop: moderateScale(3),
                fontSize: THEMES.fonts.font14,
              }}
            >
              Degree, Profession name
            </Text> */}
            <Text
              numberOfLines={1}
              style={{
                paddingTop: moderateScale(21),
                fontFamily: THEMES.fontFamily.regular,
                fontSize: THEMES.fonts.font16,
                color: THEMES.colors.black,
              }}
            >
              {`₹ ${
                selectedProvider?.profile?.sessionRateDetails[0]
                  ?.sessioncharges ||
                selectedProvider?.profile?.monthcharges[0]?.sessioncharges ||
                "0.00"
              }/Per session`}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#fff6cf",
            marginTop: moderateScale(16),
            flex: 1,
          }}
        >
          <View
            style={{
              paddingTop: moderateScale(20),
              paddingHorizontal: moderateScale(30),
              paddingBottom: moderateScale(20),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  backgroundColor: "#f9c1d3",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 98,
                  height: 70,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    color: "#AB47BC",
                    fontSize: THEMES.fonts.font12,
                    textAlign: "center",
                  }}
                >
                  Experience
                </Text>
                <Text
                  style={{
                    paddingTop: moderateScale(10),
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: "#AB47BC",
                    fontSize: THEMES.fonts.font12,
                  }}
                >
                  {`${selectedProvider?.profile?.providerBusiness?.experience} Years`}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ffe0ab",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 98,
                  height: 70,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    color: "#FD9F00",
                    fontSize: THEMES.fonts.font12,
                    textAlign: "center",
                  }}
                >
                  Rating
                </Text>
                <Text
                  style={{
                    paddingTop: moderateScale(10),
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: "#FD9F00",
                    fontSize: THEMES.fonts.font12,
                  }}
                >
                  {selectedProvider?.profile?.providerRating?.rating}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#fcc7b7",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 98,
                  height: 70,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.regular,
                    color: "#EC407A",
                    fontSize: THEMES.fonts.font12,
                    textAlign: "center",
                  }}
                >
                  Client Satisfaction
                </Text>
                <Text
                  style={{
                    paddingTop: moderateScale(10),
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: "#EC407A",
                    fontSize: THEMES.fonts.font12,
                  }}
                >
                  0%
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              borderTopRightRadius: 70,
              padding: moderateScale(23),
              backgroundColor: "#FFFDF5",
            }}
          >
            <Text
              style={{
                fontFamily: THEMES.fontFamily.semiBold,
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font14,
              }}
            >
              Bio
            </Text>
            <Text
              style={{
                fontFamily: THEMES.fontFamily.regular,
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font14,
                paddingTop: moderateScale(3),
              }}
            >
              {selectedProvider?.profile?.providerBusiness?.description}
            </Text>

            <View
              style={{
                paddingTop: moderateScale(26),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font14,
                  }}
                >
                  {`${selectedProvider?.profile?.providerRating?.totalratingcount} Reviews`}
                </Text>
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: THEMES.colors.cyan,
                    fontSize: THEMES.fonts.font12,
                  }}
                >
                  View all
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.regular,
                  color: THEMES.colors.black,
                  fontSize: THEMES.fonts.font14,
                  paddingTop: moderateScale(3),
                }}
              >
                {validArray(
                  selectedProvider?.profile?.providerRating?.highestReview
                )
                  ? selectedProvider?.profile?.providerRating?.highestReview[0]
                      ?.remark
                  : ""}
              </Text>
            </View>

            <View
              style={{
                paddingTop: moderateScale(26),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: THEMES.colors.black,
                    fontSize: THEMES.fonts.font14,
                  }}
                >
                  Address
                </Text>
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: THEMES.colors.cyan,
                    fontSize: THEMES.fonts.font12,
                  }}
                >
                  View on Map
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.regular,
                  color: THEMES.colors.black,
                  fontSize: THEMES.fonts.font14,
                  paddingTop: moderateScale(3),
                }}
              >
                {selectedProvider?.profile?.providerContact?.address}
              </Text>
            </View>
            <View style={styles.medicalDocView}>
              <Text style={styles.medicalText}>Certification</Text>
              <RightArrow stroke={THEMES.colors.cyan} />
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
            <View style={{ paddingTop: moderateScale(40) }}>
              <Button
                title="Book Appointment"
                onPress={() =>
                  navigation.navigate("selectAppointment", {
                    selectedProvider: selectedProvider,
                    selectedService: selectedService,
                  })
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  documentView: {
    flexDirection: "row",
    paddingTop: moderateScale(16),
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
  medicalDocView: {
    flexDirection: "row",
    paddingTop: moderateScale(24),
    alignItems: "center",
  },
  medicalText: {
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    paddingRight: moderateScale(8),
  },
});

export default ServiceDetail;
