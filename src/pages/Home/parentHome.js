import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import ArrowRight from "../../assets/svg/arrow-right-white.svg";
import Calendar from "../../assets/svg/calendar-white.svg";
import Clock from "../../assets/svg/clock.svg";
import Bell from "../../assets/svg/bell.svg";
import Event from "../../assets/svg/event.svg";
import Search from "../../assets/svg/search.svg";
import Toggle from "../../components/Toggle";
import {
  setLoggedInMoodule,
  validateServiceProfile,
} from "../../utils/userUtils";
import { AppointmentStatus, LoginModules } from "../../constants/enums";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Strings from "../../constants/strings";
import { showToast, validArray } from "../../utils/utils";
import { decryptService } from "../../utils/storageFunc";
import {
  getServices,
  getUpcomingAppointments,
} from "../../redux-store/actions/auth";
import moment from "moment";
import { getBase64Obj } from "../../utils/documentUtils";
import { contextValue } from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyTopics } from "../../redux-store/actions/topics";
import { SvgUri } from "react-native-svg";
import { getAllEventsApi } from "../../redux-store/actions/events";
import { vh, vw } from "../../utils/dimensions";
import Dialog from "../../components/Dialog";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import { navigateToServiceProvider } from "../../navigations/rootNavigationRef";
import { fetchUserProfileData } from "../../redux-store/actions/registerAction";
const { width: screenWidth } = Dimensions.get("window");

const { width } = Dimensions.get("window");

const ParentHome = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [appointmentData, setAppointmentData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { loggedInModule, guestUser } = useSelector((state) => state?.register);
  const profile = useSelector((state) => state?.commonReducer);
  const [serviceListData, setServiceData] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getTrendingTopics();
      getServiceList();
      initData();
      getEvents();
      dispatch(setLoggedInMoodule(LoginModules.parent));
    }
  }, [isFocused, dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfileData());
  }, [profile.refreshUserData]);

  const getEvents = async () => {
    let obj = {
      userId: await decryptService("userId"),
    };
    let res = await getAllEventsApi(obj);
    if (res?.data?.data?.length) {
      setEventData(res?.data?.data);
    }
  };

  const getServiceList = async () => {
    contextValue?.setLoader(true);
    try {
      const params = {
        service: "",
      };
      const response = await getServices(params);
      if (response?.status === 200) {
        const output = response?.data?.data;
        if (validArray(output)) {
          const firstFour = output?.slice(0, 4);
          setServiceData(firstFour);
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const getTrendingTopics = async () => {
    contextValue?.setLoader(true);
    let obj = {
      userId: await decryptService("userId"),
      searchtype: "topics",
      keyword: "",
    };
    let res = await getMyTopics(obj);
    if (res?.data?.data) {
      let dataArray = res?.data?.data?.SearchResult;
      const firstFiveObjects = dataArray?.slice(0, 5);
      setTrendingTopics(firstFiveObjects);
    }
    contextValue?.setLoader(false);
  };

  const initData = async () => {
    try {
      contextValue?.setLoader(true);

      const userId = await decryptService("userId");
      const params = {
        userid: userId,
        usertype: LoginModules?.parent,
      };
      const res = await getUpcomingAppointments(params);
      if (res?.status === 200) {
        let output = res?.data?.data;
        output = output.filter((it) => {
          return (
            it?.status === AppointmentStatus.scheduled ||
            it?.status === AppointmentStatus.rescheduled
          );
        });
        setAppointmentData(validArray(output) ? output : []);
      }

      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const renderTrendingItem = ({ item, index }) => {
    return (
      <TouchableButtonWithPermission
        customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
        customMsgForPayment="Please subscribe to get best services for your lovely pets."
        onPress={() =>
          props.navigation.navigate("trendDetail", { selectedData: item })
        }
        style={{ flexDirection: "column" }}
      >
        <View
          style={[
            styles.card,
            { marginLeft: index === 0 ? 0 : moderateScale(20) },
          ]}
        >
          <Image
            source={{ uri: item.cover }}
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.3,
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            width: 145,
            marginLeft: index === 0 ? 0 : moderateScale(20),
            borderColor: "#ddd",
            borderBottomEndRadius: 8,
            borderBottomStartRadius: 8,
            borderTopWidth: 0,
            backgroundColor: THEMES.colors.white,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              color: THEMES.colors.black,
              fontSize: THEMES.fonts.font12,
              paddingHorizontal: moderateScale(10),
              paddingVertical: moderateScale(8),
            }}
          >
            {item?.subject}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              color: THEMES.colors.darkGrey,
              fontSize: THEMES.fonts.font12,
              paddingHorizontal: moderateScale(10),
              paddingTop: moderateScale(3),
              paddingBottom: moderateScale(5),
            }}
          >
            {item?.author}
          </Text>
        </View>
      </TouchableButtonWithPermission>
    );
  };

  const renderBannerItem = ({ item, index }) => {
    return (
      <>
        {item?.documentlist?.url ? (
          <TouchableButtonWithPermission
            customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
            customMsgForPayment="Please subscribe to get best services for your lovely pets."
            onPress={() => props.navigation.navigate("upComingEvents")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: moderateScale(10),
              borderRadius: 12,
              borderBottomLeftRadius: 0,
              backgroundColor: "#fff",
              alignContent: "center",
              borderColor: THEMES.colors.lightGrey,
              borderWidth: 1,
              marginTop: moderateScale(28),
            }}
          >
            {item?.documentlist?.url ? (
              <Image
                resizeMode="cover"
                style={{
                  borderRadius: 11,
                  width: vw(320),
                  height: vh(150),
                  borderColor: THEMES.colors.lightGrey,
                  borderWidth: 1,
                }}
                source={{ uri: item?.documentlist?.url }}
              />
            ) : null}
          </TouchableButtonWithPermission>
        ) : null}
      </>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={`${item?.id}_${index}`}>
        {item.type == "Banner" ? (
          <TouchableButtonWithPermission
            customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
            customMsgForPayment="Please subscribe to get best services for your lovely pets."
            onPress={() => props.navigation.navigate("upComingEvents")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: moderateScale(15),
              borderRadius: 12,
              borderBottomLeftRadius: 0,
              backgroundColor: "#fff",
              alignContent: "center",
              borderColor: THEMES.colors.lightGrey,
              borderWidth: 1,
              marginTop: moderateScale(28),
            }}
          >
            {item.image ? (
              <Image
                style={{
                  borderRadius: 11,
                  width: "90%",
                  borderColor: THEMES.colors.lightGrey,
                  borderWidth: 1,
                }}
                source={{ uri: item.image }}
              />
            ) : (
              <Image
                style={{
                  borderRadius: 11,
                  width: "90%",
                  borderColor: THEMES.colors.lightGrey,
                  borderWidth: 1,
                }}
                source={require("../../assets/images/banner.png")}
              />
            )}
          </TouchableButtonWithPermission>
        ) : (
          <TouchableButtonWithPermission
            customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
            customMsgForPayment="Please subscribe to get best services for your lovely pets."
            onPress={() => props.navigation.navigate("serviceDetail")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: moderateScale(22),

              paddingHorizontal: moderateScale(20),
              borderRadius: 12,
              borderBottomLeftRadius: 0,
              backgroundColor: THEMES.colors.cyan,
              borderColor: THEMES.colors.lightGrey,
              borderWidth: 1,
              marginTop: moderateScale(28),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                <View style={{ width: 55, height: 55 }}>
                  <View
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: 55 / 2,
                      position: "absolute",
                      top: 0,
                      right: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fffff",
                    }}
                  >
                    <Image
                      style={{
                        width: 55,
                        height: 55,
                        borderRadius: 55 / 2,
                      }}
                      source={
                        item?.providerPhoto
                          ? getBase64Obj(item?.providerPhoto)
                          : require("../../assets/images/profileImg.png")
                      }
                    />
                  </View>
                </View>
                <View style={{ paddingLeft: moderateScale(12) }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#fff",
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font16,
                    }}
                  >
                    {item?.providername}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#CBE1FF",
                      fontFamily: THEMES.fontFamily.medium,
                      fontSize: THEMES.fonts.font14,
                      paddingTop: moderateScale(3),
                    }}
                  >
                    {item?.servicedetails?.service}
                  </Text>

                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font12,
                      paddingTop: moderateScale(5),
                    }}
                  >
                    {`OTP: ${item?.otp}`}
                  </Text>
                </View>
              </View>
              <View style={{ width: "20%", alignItems: "flex-end" }}>
                <ArrowRight size={30} stroke="#fff" />
              </View>
            </View>
            <View
              style={{
                borderBottomColor: "#fff",
                borderBottomWidth: 0.6,
                marginVertical: moderateScale(16),
                width: "100%",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "48%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar />
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.medium,
                    color: THEMES.colors.white,
                    fontSize: THEMES.fonts.font12,
                    marginLeft: moderateScale(4),
                  }}
                >
                  {`${moment(item?.appointment_date)?.format("ddd, DD MMMM")}`}
                </Text>
              </View>

              <View
                style={{
                  width: "48%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock />
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.medium,
                    color: THEMES.colors.white,
                    fontSize: THEMES.fonts.font12,
                    marginLeft: moderateScale(4),
                  }}
                >
                  {`${moment(item?.start_time, "HH:mm")?.format(
                    "h:mm"
                  )} - ${moment(item?.end_time, "HH:mm")?.format("h:mm A")}`}
                </Text>
              </View>
            </View>
          </TouchableButtonWithPermission>
        )}
      </View>
    );
  };

  const paginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {appointmentData?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? "#FC6532" : "#E7C5B3",
                width: index === activeIndex ? 20 : 12,
                height: 7,
              }, // Active dot color
            ]}
          />
        ))}
      </View>
    );
  };

  const switchProfile = () => {
    const validProviderProfile = validateServiceProfile(profile);
    modal && setModal(false);
    if (validProviderProfile?.flag) {
      navigateToServiceProvider(props.navigation);
    } else {
      props.navigation.navigate("auth", {
        screen: validProviderProfile?.navigateTo,
        params: {
          redirectFunc: () => navigateToServiceProvider(props.navigation),
        },
      });
    }
  };

  const handleSwitch = () => {
    if (profile?.providerProfile?.providerBusiness?.id) {
      switchProfile();
    } else {
      setModal(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
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
        <View
          style={{
            flexDirection: "row",
            paddingTop: moderateScale(20),
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: moderateScale(16),
          }}
        >
          <View style={{ width: "20%" }}>
            {/* <SwitchIcon /> */}
            <Toggle
              state={loggedInModule === LoginModules.provider}
              onPress={handleSwitch}
            />
          </View>
          <View style={{ width: "55%", alignItems: "center" }}>
            <Text
              style={{
                color: "#8696BB",
                fontSize: moderateScale(16),
                fontFamily: THEMES.fontFamily.regular,
              }}
            >
              Hello,
            </Text>
            <Text
              style={{
                color: "#EC407A",
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font20,
                textAlign: "center",
              }}
            >
              {`Hi ${
                profile?.parentProfie?.parentContact?.name
                  ? profile?.parentProfie?.parentContact?.name
                  : Strings.guest
              }`}
            </Text>
          </View>
          <View
            style={{
              width: "20%",
              alignItems: "flex-end",
              flexDirection: "row",
            }}
          >
            <Bell onPress={() => props.navigation.navigate("notification")} />
            <TouchableButtonWithPermission
              customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
              customMsgForPayment="Please subscribe to get best services for your lovely pets."
              isServiceProvider={false}
              onPress={() => props.navigation.navigate("upComingEvents")}
            >
              <Event style={{ marginLeft: moderateScale(17) }} />
            </TouchableButtonWithPermission>
          </View>
        </View>
        {appointmentData?.length ? (
          <Carousel
            data={appointmentData}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.9}
            onSnapToItem={(index) => setActiveIndex(index)} // Track active slide index
          />
        ) : (
          <Carousel
            data={eventData}
            renderItem={renderBannerItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.9}
            onSnapToItem={(index) => setActiveIndex(index)} // Track active slide index
          />
        )}

        {paginationDots()}
        <View>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: moderateScale(30),
            }}
          >
            <TouchableButtonWithPermission
              customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
              customMsgForPayment="Please subscribe to get best services for your lovely pets."
              onPress={() =>
                props.navigation.navigate("auth", { screen: "search" })
              }
              style={{
                padding: moderateScale(8),
                borderRadius: 25,
                borderWidth: 1.5,
                backgroundColor: "#f5f5f5",
                borderColor: "#bebebd",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Search />
              <Text
                style={{
                  paddingLeft: moderateScale(8),
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.darkGrey,
                }}
              >
                Search
              </Text>
            </TouchableButtonWithPermission>
          </View>
        </View>
        <View
          style={{
            marginTop: moderateScale(13),
            marginHorizontal: moderateScale(16),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: THEMES.fontFamily.bold,
              fontSize: THEMES.fonts.font14,
              color: THEMES.colors.black,
            }}
          >
            Services
          </Text>
          <Text
            onPress={() => props.navigation.navigate("serviceList")}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font12,
              color: THEMES.colors.cyan,
            }}
          >
            View all
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: moderateScale(32),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Boolean(serviceListData) && serviceListData?.length
            ? serviceListData?.map((item, index) => {
                return (
                  <TouchableButtonWithPermission
                    customMsgForRegistration="Please complete parent profille and subscribe to get best services for your lovely pets."
                    customMsgForPayment="Please subscribe to get best services for your lovely pets."
                    style={styles.itemContainer}
                    onPress={() =>
                      props.navigation.navigate("service", {
                        selectedService: item,
                      })
                    }
                  >
                    <View style={styles.iconContainer}>
                      <SvgUri width={35} height={35} uri={item?.logo} />
                    </View>
                    <Text numberOfLines={1} style={styles.itemText}>
                      {item?.service}
                    </Text>
                  </TouchableButtonWithPermission>
                );
              })
            : null}
        </View>

        {Boolean(trendingTopics) && trendingTopics?.length ? (
          <View
            style={{
              marginHorizontal: moderateScale(16),
              marginBottom: moderateScale(10),
              marginTop: moderateScale(30),
            }}
          >
            <Text
              style={{
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
                color: THEMES.colors.black,
                marginBottom: moderateScale(13),
              }}
            >
              Find Out What’s Trending
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={trendingTopics}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              bounces={false}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
        <Dialog
          flag={Boolean(modal)}
          title={"Info"}
          description={"Do you want to register as Service Provider?"}
          rightButtonText="Yes"
          leftButtonText="Close"
          leftButtonPressed={() => setModal(false)}
          rightButtonPressed={switchProfile}
          onClose={() => {
            setModal(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: 200,
  },
  dataCard: {
    backgroundColor: "#32AAB2", // Replace with the appropriate background color
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  subTitle: {
    color: "#B0CCE3",
    fontSize: 14,
  },
  otpText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateTimeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-around",
  },
  dateTimeText: {
    color: "#fff",
    marginLeft: 5,
  },
  imageBanner: {
    width: 300,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    marginTop: 5,
    alignSelf: "center",
  },
  dot: {
    borderRadius: 5,
    marginHorizontal: 3,
    backgroundColor: "#E7C5B3", // Default color for inactive dots
  },
  itemContainer: {
    width: (width - 40) / 3, // Dynamic width based on screen size
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#FBF7FF", // Light purple background
    borderRadius: 50, // Circular container
    height: 70,
    width: 70,
    borderRadius: 35,
    borderColor: "#AB47BC",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  itemText: {
    marginTop: 3,
    textAlign: "center",
    fontSize: THEMES.fonts.font13,
    color: "#AB47BC", // Purple text color
    fontFamily: THEMES.fontFamily.semiBold,
  },
  card: {
    width: 145, // Adjust width based on requirement
    borderRadius: 10,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    backgroundColor: THEMES.colors.white,
    overflow: "hidden", // This makes sure the image fits within the rounded corners
    elevation: 5, // For shadow in Android
    shadowColor: "#ddd", // For shadow in iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    height: moderateScale(130),
    borderWidth: 1,
    borderColor: "#ddd",
    // Spacing between cards
  },
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
});

export default ParentHome;
