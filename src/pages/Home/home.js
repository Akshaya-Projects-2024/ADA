import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Bell from "../../assets/svg/bell.svg";
import Event from "../../assets/svg/event.svg";
import Right from "../../assets/svg/chevronRight.svg";
import Plus from "../../assets/svg/plus.svg";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import LinearGradient from "react-native-linear-gradient";
import BlackCross from "../../assets/svg/cross.svg";
import Carousel from "react-native-snap-carousel";
import Modal from "react-native-modal";
import InputField from "../../components/InputField";
import ReviewComponent from "../../components/ReviewComponent";
import moment from "moment";
import Strings from "../../constants/strings";
import { showToast, validArray } from "../../utils/utils";
import Toggle from "../../components/Toggle";
import { useIsFocused } from "@react-navigation/native";
import {
  setLoggedInMoodule,
  validateParentProfile,
} from "../../utils/userUtils";
import {
  AppointmentStatus,
  ApprovalStatus,
  LoginModules,
} from "../../constants/enums";
import { useDispatch, useSelector } from "react-redux";
import AppointmentCard from "../../components/AppointmentCard";
import { decryptService } from "../../utils/storageFunc";
import {
  completeAppointment,
  confirmAppointment,
  createAppointment,
  getUpcomingAppointments,
  providerDashboardSlotsData,
} from "../../redux-store/actions/auth";
import { contextValue } from "../../components/Loader";
import Dialog from "../../components/Dialog";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../api/UserContext";
import SessionsForAppointment from "../../components/SessionsForAppointment";
import { SESSION_TYPE } from "../Services/selectAppointment";
import TouchableButtonWithPermission from "../../components/TouchableButtonWithPermission";
import {
  navigateToParent,
} from "../../navigations/rootNavigationRef";

const Home = (props) => {
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setVisible] = useState(false);
  const [attendedModal, setAttendedModal] = useState(false);
  const [otpInput, setOtpInput] = useState();
  const [appointmentVisible, setAppointmentVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { width: screenWidth } = Dimensions.get("window");
  const [appointmentData, setAppointmentData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [totalBookedSlots, setTotalBookedSlots] = useState(0);
  const [totalSlots, setTotalSlots] = useState(0);
  const { loggedInModule, guestUser } = useSelector((state) => state?.register);
  const profile = useSelector((state) => state?.commonReducer);
  const [appointmentConfirm, setAppointmentConfirm] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const { userData, apiInitCall } = useUser();
  const [modal, setModal] = useState(false);

  const handleSubmit = async (
    selectedDate,
    startDate,
    endDate,
    selectedSlot,
    sessionSelection
  ) => {
    try {
      contextValue?.setLoader(true);
      if (!selectedCategory?.code) {
        throw new Error("Invalid Service! Please select valid service");
      } else if (!selectedDate) {
        throw new Error("Please Select valid date");
      } else if (!startDate) {
        throw new Error("Please Select valid start date");
      } else if (!endDate) {
        throw new Error("Please Select valid end date");
      } else if (!selectedSlot?.start_time) {
        throw new Error("Please Select valid time slot");
      } else if (!selectedSlot?.end_time) {
        throw new Error("Please Select valid time slot");
      } else if (!clientName) {
        throw new Error("Please provide client name");
      } else if (!mobileNumber) {
        throw new Error("Please provide client mobile number");
      } else {
        const userId = await decryptService("userId");
        const params = {
          parent_id: "",
          provider_id: userId,
          service_code: Number(selectedCategory?.code),
          start_date:
            sessionSelection === SESSION_TYPE.oneTime
              ? moment(selectedDate).format("YYYY-MM-DD")
              : moment(startDate).format("YYYY-MM-DD"),
          end_date:
            sessionSelection === SESSION_TYPE.oneTime
              ? moment(selectedDate).format("YYYY-MM-DD")
              : moment(endDate).format("YYYY-MM-DD"),
          start_time: selectedSlot?.start_time,
          end_time: selectedSlot?.end_time,
          status: "scheduled", //HARDCODE
          notes: "First appointment of the day", //HARDCODE
          petid: 0,
          requestedby: "provider", //HARDCODE
          clientname: clientName,
          contactnum: mobileNumber,
        };
        const res = await createAppointment(params);
        if (res?.status === 200) {
          showToast("success", res?.data?.data || String.appointmentConfirm);
        }
      }
      initData(); //TODO
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    } finally {
      setSelectedCategory(null);
      setClientName("");
      setMobileNumber("");
      setAppointmentVisible(false);
    }
  };

  const paymentCompleted = useMemo(() => {
    if (
      profile?.providerProfile?.subscription?.status === "active" &&
      profile?.logindetails?.isprovider === ApprovalStatus.approved
    ) {
      return { flag: true };
    } else if (
      profile?.providerProfile?.subscription?.status === "active" &&
      profile?.logindetails?.isprovider !== ApprovalStatus.approved
    ) {
      return { flag: false, message: Strings.approvaltError };
    }
    return { flag: false, message: Strings.paymentError };
  }, [
    profile?.logindetails?.isprovider,
    profile?.providerProfile?.subscription?.status,
  ]);

  useEffect(() => {
    if (isFocused) {
      initData();
      dispatch(setLoggedInMoodule(LoginModules.provider));
    } else {
      setVisible(false);
      setAttendedModal(false);
      setAppointmentConfirm(false);
      setPaymentModal(false);
      setOtpInput("");
      setSelectedItem();
    }
    apiInitCall();
  }, [isFocused, dispatch, initData, apiInitCall]);

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory === item;
    return (
      <TouchableOpacity
        style={[styles.categoryButton, isSelected && styles.selectedButton]}
        onPress={() => setSelectedCategory(item)}
      >
        <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
          {item?.service}
        </Text>
      </TouchableOpacity>
    );
  };

  const initData = useCallback(async () => {
    contextValue?.setLoader(true);
    getAppointmentData();
    getSlotsData();
  }, []);

  const getAppointmentData = async () => {
    try {
      const userId = await decryptService("userId");
      const params = {
        userid: userId,
        usertype: LoginModules?.provider,
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

  const getSlotsData = async () => {
    try {
      const userId = await decryptService("userId");
      const start = moment();
      const end = moment(start).add(14, "days");
      const params = {
        userid: userId,
        providerid: userId,
        startdate: start.format("YYYY-MM-DD"),
        enddate: end.format("YYYY-MM-DD"),
      };
      const res = await providerDashboardSlotsData(params);
      if (res?.status === 200) {
        let output = [];
        let confirmedAppointments = 0;
        let attendedAppointments = 0;
        let canceledAppointments = 0;
        let rescheduledAppointments = 0;
        const response = Object.values(res?.data?.data);
        for (let index = 0; index < response.length; index++) {
          const element = response[index];
          for (let index2 = 0; index2 < element.length; index2++) {
            if (output?.length < 15) {
              const element2 = element[index2];
              if (element2?.status === AppointmentStatus.cancelled) {
                canceledAppointments++;
              } else if (element2?.status === AppointmentStatus.completed) {
                attendedAppointments++;
              } else if (element2?.status === AppointmentStatus.rescheduled) {
                rescheduledAppointments++;
              } else if (element2?.status === AppointmentStatus.scheduled) {
                confirmedAppointments++;
              }
              output.push(element2);
            }
          }
        }
        setCountData([
          {
            count: confirmedAppointments,
            status: "Confirmed",
            color: "#7DB857",
          },
          {
            count: attendedAppointments,
            status: "Attended",
            color: "#00BBC8",
          },
          {
            count: canceledAppointments,
            status: "Canceled",
            color: "#F4521F",
          },
          {
            count: rescheduledAppointments,
            status: "Rescheduled",
            color: "#FD9F00",
          },
        ]);
        setTotalBookedSlots(confirmedAppointments);
        setTotalSlots(
          confirmedAppointments +
            attendedAppointments +
            canceledAppointments +
            rescheduledAppointments
        );
        setSlotsData(output);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <AppointmentCard
        item={item}
        routeFrom={"myprofile"}
        setAttendedModal={setAttendedModal}
        setSelectedItem={setSelectedItem}
        setVisible={setVisible}
        setAppointmentConfirm={setAppointmentConfirm}
      />
    );
  };

  const paginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {appointmentData.map((_, index) => (
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
    const validParentProfile = validateParentProfile(profile);
    modal && setModal(false);
    if (validParentProfile?.flag) {
      navigateToParent(props.navigation);
    } else {
      props.navigation.navigate(validParentProfile?.navigateTo, {
        route: "parentAccount",
        redirectFunc: () => {
          navigateToParent(props.navigation);
        },
      });
    }
  };

  const handlePremiumActionPressed = (premiumAction) => {
    if (paymentCompleted?.flag) {
      premiumAction();
    } else {
      setPaymentModal(true);
    }
  };

  const onTodayPressed = () => {
    props.navigation.navigate("myBookings", {
      route: "myprofile",
      isToday: true,
    });
  };

  const handleAttended = async () => {
    try {
      contextValue?.setLoader(true);
      if (!selectedItem) {
        throw new Error("Please select the appointment!");
      } else if (!otpInput) {
        throw new Error("Please enter OTP first!");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
          otp: otpInput,
        };
        const res = await completeAppointment(params);
        if (res?.status === 200) {
          setVisible(false);
          setAttendedModal(false);
          setAppointmentConfirm(false);
          setOtpInput("");
          setSelectedItem();
          initData();
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const confirm = async () => {
    try {
      contextValue?.setLoader(true);
      if (!selectedItem) {
        throw new Error("Please select the appointment!");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
        };
        const res = await confirmAppointment(params);
        if (res?.status === 200) {
          setVisible(false);
          setAttendedModal(false);
          setAppointmentConfirm(false);
          setOtpInput("");
          setSelectedItem();
          initData();
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const onAppointmentClose = () => {
    setAppointmentConfirm(false);
    setSelectedItem();
  };

  const onCancel = () => {
    props.navigation.navigate("cancelAppointment", {
      selectedItem: selectedItem,
    });
  };

  const onReschedule = () => {
    props.navigation.navigate("rescheduleAppointment", {
      selectedItem: selectedItem,
    });
  };

  const handleSwitch = () => {
    if (profile?.parentProfie?.parentContact?.id) {
      switchProfile();
    } else {
      setModal(true);
    }
  };

  return (
    <LinearGradient
      locations={[0, 0.5, 0.6]}
      colors={["#f6fbf4", "#d0f1f8", "#f0f9f6"]}
      style={{ flex: 1 }}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={"dark-content"}
      />
      <View style={{ flex: 1, paddingTop: moderateScale(top) }}>
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingHorizontal: moderateScale(16) }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingTop: moderateScale(20),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "20%" }}>
              <Toggle
                state={loggedInModule === LoginModules.provider}
                onPress={handleSwitch}
              />
              {/* <SwitchIcon /> */}
            </View>
            <View style={{ width: "55%", alignItems: "center" }}>
              <Text
                style={{
                  color: THEMES.colors.darkGrey,
                  fontSize: moderateScale(16),
                  fontFamily: THEMES.fontFamily.medium,
                }}
              >
                Hello,
              </Text>
              <Text
                style={{
                  color: THEMES.colors.cyan,
                  fontFamily: THEMES.fontFamily.bold,
                  fontSize: THEMES.fonts.font20,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {`Hi ${
                  profile?.providerProfile?.providerBusiness?.name
                    ? profile?.providerProfile?.providerBusiness?.name
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
                customMsgForRegistration={
                  "Complete your Registration and Subscribe to the app to create new events."
                }
                onPress={() => props.navigation.navigate("createEvent")}
              >
                <Event style={{ marginLeft: moderateScale(17) }} />
              </TouchableButtonWithPermission>
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              padding: moderateScale(10),
              marginTop: moderateScale(14),
              borderRadius: moderateScale(16),
              backgroundColor: "#fff",
              borderColor: "#ddd",
              shadowColor: THEMES.colors.lightGrey,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                backgroundColor: THEMES.colors.white,
                paddingHorizontal: moderateScale(5),
                paddingVertical: moderateScale(5),
                borderRadius: moderateScale(12),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center ",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    onPress={onTodayPressed}
                    style={{
                      color: THEMES.colors.cyan,
                      fontSize: THEMES.fonts.font12,
                      fontFamily: THEMES.fontFamily.medium,
                      paddingRight: moderateScale(10),
                    }}
                  >
                    Today’s Appointments
                  </Text>
                  <Right />
                </View>
                <TouchableButtonWithPermission
                  hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                  customMsgForRegistration={
                    "Complete your Registration and Subscribe to the app to create new appointments."
                  }
                  onPress={() =>
                    handlePremiumActionPressed(() => {
                      setAppointmentVisible(true);
                      Strings.appointmentError;
                    })
                  }
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: THEMES.colors.cyan,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus stroke={THEMES.colors.white} />
                </TouchableButtonWithPermission>
              </View>
              <View style={{ paddingTop: moderateScale(23) }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center ",
                  }}
                >
                  <View style={{ width: "75%" }}>
                    <View style={styles.chartContainer}>
                      <View style={styles.timeBar}>
                        {slotsData.map((block, index) => (
                          <View
                            key={index}
                            style={[
                              styles.block,
                              {
                                backgroundColor:
                                  block?.status === AppointmentStatus.cancelled
                                    ? "#F4521F"
                                    : block?.status ===
                                      AppointmentStatus.completed
                                    ? "#00BBC8"
                                    : block?.status ===
                                      AppointmentStatus.rescheduled
                                    ? "#FD9F00"
                                    : block?.status ===
                                      AppointmentStatus.scheduled
                                    ? "#7DB857"
                                    : "#B8B8B8",
                              },
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={{ width: "20%", alignItems: "flex-end" }}>
                    <Text
                      style={{
                        color: THEMES.colors.darkGrey,
                        fontFamily: THEMES.fontFamily.medium,
                        fontSize: THEMES.fonts.font14,
                      }}
                    >
                      {`${totalBookedSlots || 0}/${slotsData?.length || 0}`}
                    </Text>
                    <Text
                      style={{
                        color: THEMES.colors.darkGrey,
                        fontFamily: THEMES.fontFamily.medium,
                        fontSize: THEMES.fonts.font8,
                      }}
                    >
                      Booked Slots
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                paddingTop: moderateScale(12),
                borderTopColor: THEMES.colors.lightGrey,
                borderTopWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {countData.map((item, index) => {
                  return (
                    <View>
                      <Text
                        style={{
                          color: item.color,
                          fontFamily: THEMES.fontFamily.semiBold,
                          fontSize: THEMES.fonts.font10,
                        }}
                      >
                        {item.count}
                      </Text>
                      <Text
                        style={{
                          color: item.color,
                          fontFamily: THEMES.fontFamily.semiBold,
                          fontSize: THEMES.fonts.font10,
                          paddingTop: moderateScale(2),
                        }}
                      >
                        {item.status}
                      </Text>
                    </View>
                  );
                })}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#000",
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font10,
                    }}
                  >
                    {totalSlots || 0}
                  </Text>
                  <Text
                    style={{
                      color: "#000",
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font10,
                      paddingTop: moderateScale(2),
                    }}
                  >
                    Total
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingTop: appointmentData?.length !== 0 ? moderateScale(35) : 0,
            }}
          >
            {appointmentData?.length !== 0 && (
              <Text
                style={{
                  color: "#000",
                  fontFamily: THEMES.fontFamily.semiBold,
                  fontSize: THEMES.fonts.font14,
                }}
              >
                Next Appointment
              </Text>
            )}

            <View
              style={{
                paddingTop: moderateScale(9),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Carousel
                data={appointmentData}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth * 0.9}
                onSnapToItem={(index) => setActiveIndex(index)} // Track active slide index
              />
              {paginationDots()}
            </View>
          </View>

          <View
            style={{
              paddingTop: moderateScale(17),
              paddingBottom: moderateScale(5),
            }}
          >
            <Text
              style={{
                color: "#000",
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
              }}
            >
              Client Reviews
            </Text>
          </View>
          <View>
            <TouchableButtonWithPermission
              customMsgForRegistration={
                "Get Registered and subscribe to enjoy all exciting features of ADA app."
              }
              activeOpacity={1}
              onPress={() => props.navigation.navigate("clientReview")}
              style={styles.headerView}
            >
              <View style={styles.headerRow}>
                <View style={styles.w25}>
                  <Text style={styles.reviewCount}>
                    {profile?.providerProfile?.providerRating?.rating}
                  </Text>
                  <Text
                    style={styles.reviewsText}
                  >{`${profile?.providerProfile?.providerRating?.totalratingcount} Reviews`}</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.w70}>
                  <ReviewComponent
                    reviewData={[
                      {
                        stars: 5,
                        count:
                          profile?.providerProfile?.providerRating
                            ?.providerRatingCount?.five || 0,
                        bgColor: "#FDD835",
                      },
                      {
                        stars: 4,
                        count:
                          profile?.providerProfile?.providerRating
                            ?.providerRatingCount?.four || 0,
                        bgColor: "#fcc7b7",
                      },
                      {
                        stars: 3,
                        count:
                          profile?.providerProfile?.providerRating
                            ?.providerRatingCount?.three || 0,
                        bgColor: "#6dae43",
                      },
                      {
                        stars: 2,
                        count:
                          profile?.providerProfile?.providerRating
                            ?.providerRatingCount?.two || 0,
                        bgColor: "#21c2ce",
                      },
                      {
                        stars: 1,
                        count:
                          profile?.providerProfile?.providerRating
                            ?.providerRatingCount?.one || 0,
                        bgColor: "#ab47bc",
                      },
                    ]}
                    totalReviews={5}
                  />
                </View>
              </View>
            </TouchableButtonWithPermission>
          </View>
        </ScrollView>
      </View>
      <Modal
        onBackdropPress={() => {
          setVisible(false);
          setSelectedItem();
        }}
        isVisible={isVisible}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          borderRadius: 16,
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: THEMES.colors.bgColor,
            paddingVertical: moderateScale(24),
            paddingHorizontal: moderateScale(24),
            borderRadius: 16,
            marginHorizontal: moderateScale(30),
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font16,
                width: "70%",
                lineHeight: moderateScale(24),
              }}
            >
              Need to Change Your Plans?
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
              onPress={() => {
                setVisible(false);
                setSelectedItem();
              }}
            >
              <BlackCross />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: THEMES.colors.black,
              fontFamily: THEMES.fontFamily.regular,
              fontSize: THEMES.fonts.font14,
              paddingTop: moderateScale(16),
              lineHeight: moderateScale(20),
            }}
          >
            Do you want to cancel the appointment, or would you like to
            reschedule it instead?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: moderateScale(31),
            }}
          >
            <View style={{ width: "45%" }}>
              <Button onlyBorder title="Cancel" onPress={() => onCancel()} />
            </View>
            <View style={{ width: "45%" }}>
              <Button title="Reschedule" onPress={() => onReschedule()} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        onBackdropPress={() => {
          setAttendedModal(false);
          setSelectedItem();
          setOtpInput("");
        }}
        isVisible={attendedModal}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          borderRadius: 16,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            borderTopRightRadius: 49,
            paddingVertical: moderateScale(20),
            backgroundColor: THEMES.colors.white,
          }}
        >
          <Text
            style={{
              color: THEMES.colors.black,
              paddingHorizontal: moderateScale(31),
              fontFamily: THEMES.fontFamily.semiBold,
            }}
          >
            Enter OTP to confirm
          </Text>
          <View
            style={{
              paddingTop: moderateScale(36),
              marginHorizontal: moderateScale(24),
            }}
          >
            <InputField
              label={"Enter otp"}
              placeholderText={"Enter otp"}
              value={otpInput}
              onChange={setOtpInput}
            />

            <View style={{ paddingTop: moderateScale(20) }}>
              <Button onPress={handleAttended} title="Attended" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        onBackButtonPress={() => setAppointmentVisible(false)}
        onBackdropPress={() => setAppointmentVisible(false)}
        isVisible={appointmentVisible}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          marginTop: moderateScale(50),
          borderTopRightRadius: 49,
          flex: 1,
          backgroundColor: THEMES.colors.bgColor,
          alignItems: "flex-start",
          paddingHorizontal: moderateScale(16),
          paddingTop: moderateScale(10),
        }}
      >
        <View
          style={{
            paddingTop: moderateScale(20),
            flex: 1,
          }}
        >
          <Text
            style={{
              color: THEMES.colors.black,
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font14,
            }}
          >
            Add Appointment
          </Text>
          <View style={{ paddingTop: moderateScale(15) }}>
            <InputField
              label={"Client name *"}
              placeholderText={"Enter client name"}
              value={clientName}
              onChange={setClientName}
            />
          </View>
          <View style={{ paddingTop: moderateScale(15) }}>
            <InputField
              maxLength={10}
              keyboardType="phone-pad"
              label={"Mobile number *"}
              placeholderText={"Enter mobile number"}
              value={mobileNumber}
              onChange={setMobileNumber}
            />
          </View>
          <View style={{ paddingTop: moderateScale(15), width: "90%" }}>
            <Text
              style={{
                color: THEMES.colors.black,
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
                paddingBottom: moderateScale(10),
              }}
            >
              Category
            </Text>
            <FlatList
              data={userData?.providerProfile?.providerBusiness?.services}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategory}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <SessionsForAppointment
            selectedProviderId={userData?.logindetails?.userid}
            handleSubmit={handleSubmit}
            buttonTitle="Add"
          />
        </View>
      </Modal>
      <Dialog
        flag={appointmentConfirm}
        description={Strings.confirmAppointmentMessage}
        leftButtonText="No"
        rightButtonText="Yes"
        leftButtonPressed={onAppointmentClose}
        rightButtonPressed={confirm}
        onClose={onAppointmentClose}
      />
      <Dialog
        flag={paymentModal}
        title={Strings.attention}
        description={paymentCompleted?.message}
        leftButtonText="Cancel"
        rightButtonText="OK"
        leftButtonPressed={() => {
          setPaymentModal(false);
        }}
        rightButtonPressed={() => {
          if (profile?.providerProfile?.subscription?.status === "active") {
            setPaymentModal(false);
          } else if (guestUser) {
            props?.navigation.replace("auth");
          } else {
            props.navigation.navigate("auth", {
              screen: "paymentsSubscription",
            });
          }
        }}
        onClose={() => {
          setPaymentModal(false);
        }}
      />
      <Dialog
        flag={modal}
        title={"Info"}
        description={"Do you want to register as Pet Parent?"}
        rightButtonText="Yes"
        leftButtonText="Close"
        leftButtonPressed={() => setModal(false)}
        rightButtonPressed={switchProfile}
        onClose={() => {
          setModal(false);
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  nowContainer: {
    position: "absolute",
    top: -20, // Move "Now" text above the time blocks
    left: "15%", // Same as the marker's left position
    alignItems: "center",
  },
  nowText: {
    color: "gray",
    marginBottom: 2, // Space between text and line
  },
  timeMarker: {
    position: "absolute",
    left: "15%", // Adjust based on where you want the red line
    height: 40,
    width: 1,
    backgroundColor: "#FC6532",
  },
  timeBar: {
    flexDirection: "row",
    width: "100%",
    height: 20,
    justifyContent: "space-between",
  },
  block: {
    flex: 1,
    margin: 1,
    height: 25,
    width: 5,
    borderRadius: 2,
  },

  flatlistView: {
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: THEMES.colors.lightGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: moderateScale(10),
    paddingVertical: moderateScale(2),
  },
  flatlistContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
  },
  flatListRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatListImgView: {
    width: 55,
    height: 55,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  tagView: {
    backgroundColor: "#f2e2f4",
    position: "absolute",
    paddingVertical: moderateScale(3),
    paddingHorizontal: moderateScale(8),
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: moderateScale(1),
  },
  tagText: {
    color: "#AB47BC",
    fontSize: THEMES.fonts.font9,
    fontWeight: "bold",
  },
  content: {
    padding: moderateScale(24),
    backgroundColor: THEMES.colors.white,
    borderTopStartRadius: 16,
    borderTopRightRadius: 16,
  },
  flatListNameRow: {
    flexDirection: "row",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  profileTypeText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  visitTypeText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  statusConfmText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusCancleText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  statusText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.bold,
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
  headerView: {
    backgroundColor: THEMES.colors.white,
    paddingHorizontal: moderateScale(15),
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: moderateScale(20),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  w25: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewCount: {
    fontFamily: THEMES.fontFamily.bold,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font32,
  },
  reviewsText: {
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.darkGrey,
    fontSize: THEMES.fonts.font12,
  },
  line: {
    width: 1,
    height: 58,
    backgroundColor: "#D9D9D9",
    marginVertical: moderateScale(54),
  },
  w70: {
    width: "70%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#797979",
    borderEndStartRadius: 0,
    margin: 4,
  },
  selectedButton: {
    backgroundColor: THEMES.colors.cyan, // Change to the selected color
    borderColor: "transparent",
  },
  categoryText: {
    color: "#707070",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font13,
  },
  selectedText: {
    color: "#fff",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font13,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEMES.colors.bgColor,
    borderRadius: 20,
    paddingTop: moderateScale(15),
  },
  switch: {
    // marginHorizontal: 8,
  },
  selectedRadioText: {
    color: "#000", // Darker color for selected text
    fontWeight: "bold",
  },
  unselectedRadioText: {
    color: "#a9a9a9", // Lighter color for unselected text
  },
  dateContainer: {
    borderWidth: 0.8,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 8,
    borderEndStartRadius: 0,
    alignItems: "center ",
    justifyContent: "center",
    paddingVertical: moderateScale(7),
  },
  dateValue: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  datePlaceholderText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  contentContainer: {
    alignItems: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    minWidth: 70,
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#5cc4c4",
  },
  unselectedTimeSlot: {
    backgroundColor: "#e0e0e0",
  },
  selectedTimeText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  unselectedTimeText: {
    color: "#000000",
  },
  timeSlotRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures time slots wrap to the next line
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#ffffff",
    borderColor: "#CFD3D4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    margin: 5,
  },
  selectedSlotStyle: {
    backgroundColor: THEMES.colors.cyan,
  },
  disabledSlot: {
    backgroundColor: "#f0f0f0", // Gray background for disabled slots
    borderColor: "#d0d0d0",
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

export default Home;
