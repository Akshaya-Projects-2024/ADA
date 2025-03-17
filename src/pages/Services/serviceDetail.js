import React, { useCallback, useEffect, useState } from "react";
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
  Linking,
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
import { showToast, validArray } from "../../utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import ProviderFallback from "../../assets/svg/ProviderFallback";
import {
  bookmarkApi,
  getProviderSlots,
  shareProfileApi,
} from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import ShareApp from "react-native-share";
import { contextValue } from "../../components/Loader";
import moment from "moment";
import Dialog from "../../components/Dialog";

const ServiceDetail = ({ navigation, route }) => {
  const selectedProvider = route?.params?.selectedProvider;
  const selectedService = route?.params?.selectedService;
  const filteredData = selectedProvider?.profile?.providerDocument?.filter(
    (item) => item.documenttype !== "companylogo"
  );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [bookmark, setBookmark] = useState(
    selectedProvider?.bookmarked == 1 ? true : false
  );
  const [bookAppointmentDisabled, setBookAppointmentBtnDisbaled] = useState();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getDates();
  }, []);

  const share = async () => {
    try {
      let obj = {
        userid: await decryptService("userId"),
        vendor: selectedProvider?.profile?.providerBusiness?.userid,
      };
      let res = await shareProfileApi(obj);
      if (res) {
        const shareData = {
          title: "Share",
          message: "Share this profile",
          url: `data:image/jpeg;base64,${res}`, // Base64 encoded image
        };
        await ShareApp.open(shareData);
      }
    } catch (error) {
      console.log("ero", error);
    }
  };

  const getDates = useCallback(async () => {
    const start = moment();
    const end = moment(start).add(14, "days");
    const params = {
      userid: await decryptService("userId"),
      providerid: selectedProvider?.profile?.providerBusiness?.userid,
      startdate: moment(start)?.format("YYYY-MM-DD"),
      enddate: moment(end)?.format("YYYY-MM-DD"),
    };
    const res = await getProviderSlots(params);
    if (Object.keys(res?.data?.data).length === 0) {
      setBookAppointmentBtnDisbaled(true);
    }
  }, []);

  const addBookmarkMethod = async () => {
    try {
      contextValue?.setLoader(true);
      let obj = {
        userid: await decryptService("userId"),
        servicecode: selectedService?.code,
        provider: selectedProvider?.profile?.providerBusiness?.userid,
        isactive: 1,
      };

      let res = await bookmarkApi(obj);
      if (res) {
        setBookmark(true);
      } else {
        setBookmark(false);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
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
            <TouchableOpacity onPress={() => addBookmarkMethod()}>
              <Bookmark
                fill={bookmark ? "#FFAE42" : "white"}
                stroke={bookmark ? "#FFAE42" : "black"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => share()}
              style={{ marginLeft: moderateScale(20) }}
            >
              <Share />
            </TouchableOpacity>
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
                backgroundColor: "#fff",
                height: 105,
                width: 97,
                borderRadius: 12,
                elevation: 5,
              }}
            >
              {selectedProvider?.photo ? (
                <Image
                  style={{
                    height: 105,
                    width: 97,
                    borderRadius: 12,
                  }}
                  source={getBase64Obj(selectedProvider?.photo)}
                />
              ) : (
                <View
                  style={{
                    height: 105,
                    width: 97,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ProviderFallback width={80} height={100} />
                </View>
              )}
            </View>
            {console.log("selectedProvider",selectedProvider)}
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
              <Text
              numberOfLines={1}
              style={{
                fontFamily: THEMES.fontFamily.medium,
                paddingTop: moderateScale(3),
                fontSize: THEMES.fonts.font14,
              }}
            >
              {selectedProvider?.profile?.providerBusiness?.services?.map(item => item.service).join(", ")}
            </Text>
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
                  "0"
                }/Per session`}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#fff6cf",
              marginTop: moderateScale(16),
              flex: 1,
              borderTopRightRadius: 50,
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
                    {(selectedProvider?.profile?.providerRating?.rating / 5) *
                      100}
                    %
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                borderTopRightRadius: 50,
                padding: moderateScale(23),
                backgroundColor: "#fff",
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
                  {selectedProvider?.profile?.providerRating
                    ?.totalratingcount !== 0 && (
                    <Text
                      onPress={() =>
                        navigation.navigate("parentReviews", {
                          selectedService: selectedProvider,
                        })
                      }
                      style={{
                        fontFamily: THEMES.fontFamily.semiBold,
                        color: THEMES.colors.cyan,
                        fontSize: THEMES.fonts.font12,
                      }}
                    >
                      View all
                    </Text>
                  )}
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
                    ? selectedProvider?.profile?.providerRating
                        ?.highestReview?.[0]?.remark
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
                  {/* <Text
                    style={{
                      fontFamily: THEMES.fontFamily.semiBold,
                      color: THEMES.colors.cyan,
                      fontSize: THEMES.fonts.font12,
                    }}
                  >
                    View on Map
                  </Text> */}
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
                  {filteredData?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.url)}
                        style={[
                          styles.documents,
                          { marginLeft: index === 0 ? 0 : moderateScale(10) },
                        ]}
                      >
                        <Text style={styles.docText}>{`Document ${
                          index + 1
                        }`}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={{ paddingTop: moderateScale(40) }}>
                <Button
                  title="Book Appointment"
                  onPress={() =>
                    bookAppointmentDisabled
                      ? setModal(true)
                      : navigation.navigate("selectAppointment", {
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
      <Dialog
        flag={modal}
        title={"No slots Available"}
        description={
          "All slots are currently booked. Please check again later or try selecting a different time."
        }
        rightButtonText="Okay"
        rightButtonPressed={() => setModal(false)}
        onClose={() => {
          setModal(false);
        }}
      />
    </SafeAreaView>
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
