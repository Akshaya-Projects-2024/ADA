import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import SwitchIcon from "../../assets/svg/switch.svg";
import Bell from "../../assets/svg/bell.svg";
import Event from "../../assets/svg/event.svg";
import Right from "../../assets/svg/chevronRight.svg";
import Plus from "../../assets/svg/plus.svg";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import ModalDropdown from "../../components/ModalDropdown";
import Stepper from "../../components/Stepper";
import LinearGradient from "react-native-linear-gradient";
import Filter from "../../assets/svg/listFilter.svg";
import Check from "../../assets/svg/check.svg";
import Cross from "../../assets/svg/redCross.svg";
import BlackCross from "../../assets/svg/cross.svg";
import Carousel from "react-native-snap-carousel";
import Modal from "react-native-modal";
import InputField from "../../components/InputField";
import ReviewComponent from "../../components/ReviewComponent";

const colorData = [
  { color: "#4FC3F7" }, // Example of blue
  { color: "#4FC3F7" }, // Example of blue
  { color: "#81C784" }, // Example of green
  { color: "#81C784" }, // Example of green
  { color: "#81C784" }, // Example of green
  { color: "#BDBDBD" }, // Example of grey
  { color: "#BDBDBD" },
  { color: "#81C784" }, // Example of green
  { color: "#81C784" }, // Example of green
  { color: "#BDBDBD" }, // Example of grey
  { color: "#BDBDBD" },
  { color: "#BDBDBD" },
  { color: "#BDBDBD" },
  { color: "#81C784" }, // Example of green
  { color: "#81C784" }, // Example of green
  { color: "#BDBDBD" }, // Example of grey
  { color: "#BDBDBD" },
  { color: "#BDBDBD" },
];

const countData = [
  {
    count: 6,
    status: "Confirmed",
    color: "#7DB857",
  },
  {
    count: 2,
    status: "Attended",
    color: "#00BBC8",
  },
  {
    count: 1,
    status: "Canceled",
    color: "#F4521F",
  },
  {
    count: 1,
    status: "Rescheduled",
    color: "#FD9F00",
  },
];

const appointmentData = [
  {
    id: 1,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh1",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 2,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
  {
    id: 3,
    profile: "../../assets/images/profileImg.png",
    name: "Rajneesh",
    visitType: "Home visit",
    category: "Basic Obedience",
    visitDay: "Today",
    time: "5:30 PM",
    isSeduled: false,
  },
];

const Home = (props) => {
  const [selectedValue, setSelectedValue] = useState();
  const { colors, fontFamily, fonts } = THEMES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendedId, setSelectedAttendedId] = useState();
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Daily");
  const [attendedModal, setAttendedModal] = useState(false);
  const [otpInput, setOtpInput] = useState();
  const [data, setData] = useState(appointmentData);

  const renderItem = ({ item }) => {
    let itemBackgroundColor = THEMES.colors.white;
    console.log("item, ", item);
    if (item.isCanceled) {
      itemBackgroundColor = "#fee9e9";
    } else if (item.isConfirmed) {
      itemBackgroundColor = "#f0ffe6";
    } else if (item.isSeduled) {
      itemBackgroundColor = "#feefd4";
    } else if (item.isAttended) {
      itemBackgroundColor = "#d6f2f5";
    }
    let itemtextColor = THEMES.colors.black;
    if (item.isCanceled) {
      itemtextColor = "#F4511E";
    } else if (item.isConfirmed) {
      itemtextColor = "#6DAE43";
    } else if (item.isSeduled) {
      itemtextColor = "#FD9F00";
    } else if (item.isAttended) {
      itemtextColor = "#02bac7";
    }
    return (
      <Pressable
        onPress={() => {
          setSelectedItemId(item.id);
          props.navigation.navigate("appointmentDetail");
        }}
        style={[styles.flatlistView, { backgroundColor: itemBackgroundColor }]}
      >
        {!item.isSeduled && !item.isCanceled && !item.isConfirmed ? (
          <View style={styles.tagView}>
            <Text style={styles.tagText}>New</Text>
          </View>
        ) : null}

        <View style={styles.flatlistContent}>
          <View style={styles.flatListRow}>
            <View style={styles.flatListImgView}>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
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
                    width: 32,
                    height: 32,
                    borderRadius: 32 / 2,
                  }}
                  source={require("../../assets/images/profileImg.png")}
                />
              </View>
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <Image
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 32 / 2,
                  }}
                  source={require("../../assets/images/profileImg.png")}
                />
              </View>
            </View>

            <View
              style={{
                marginHorizontal: moderateScale(8),
                paddingVertical: moderateScale(5),
              }}
            >
              <Text style={[styles.name]}>{item.name}</Text>
              <View style={styles.flatListNameRow}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: moderateScale(1),
                  }}
                >
                  <Text
                    style={[
                      styles.profileTypeText,
                      { paddingRight: moderateScale(3) },
                    ]}
                  >
                    {item.category}
                  </Text>
                  <Text style={styles.profileTypeText}>|</Text>
                  <Text
                    style={[
                      styles.profileTypeText,
                      ,
                      { paddingLeft: moderateScale(3) },
                    ]}
                  >
                    {item.visitType}
                  </Text>
                </View>
              </View>
              <View style={styles.flatListNameRow}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.visitTypeText,
                      {
                        marginRight: moderateScale(5),
                        textDecorationLine: item.isSeduled
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    {item.visitDay}
                  </Text>
                  <Text
                    style={[
                      styles.visitTypeText,
                      {
                        marginRight: moderateScale(5),
                        textDecorationLine: item.isSeduled
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    |
                  </Text>
                  <Text
                    style={[
                      styles.visitTypeText,
                      {
                        textDecorationLine: item.isSeduled
                          ? "line-through"
                          : "none",
                      },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
                {item.isSeduled && (
                  <Text style={styles.visitTypeText}>26th JUN @ 11:00 AM</Text>
                )}
              </View>
            </View>
          </View>
          <View>
            {item.isCanceled ? (
              <Text style={[(styles.statusText, { color: itemtextColor })]}>
                Canceled
              </Text>
            ) : item.isConfirmed ? (
              <TouchableOpacity
                onPress={() => {
                  setSelectedAttendedId(item.id);
                  setAttendedModal(true);
                }}
                style={{
                  borderRadius: 8,
                  borderBottomStartRadius: 0,
                  borderWidth: 1,
                  paddingHorizontal: moderateScale(12),
                  paddingVertical: moderateScale(6),
                  borderColor: "#6DAE43",
                }}
              >
                <Text style={(styles.statusText, { color: itemtextColor })}>
                  Confirm
                </Text>
              </TouchableOpacity>
            ) : item.isAttended ? (
              <Text style={(styles.statusText, { color: itemtextColor })}>
                Attended
              </Text>
            ) : item.isSeduled ? (
              <Text
                style={
                  (styles.statusText,
                  {
                    color: itemtextColor,
                  })
                }
              >
                Rescheduled
              </Text>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => setVisible(true)}>
                  <Cross width={24} height={24} />
                </Pressable>
                <Pressable
                  onPress={() => handleOnConfirm(item.id)}
                  style={{ marginLeft: moderateScale(12) }}
                >
                  <Check width={24} height={24} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const handleConfirm = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, isConfirmed: true, isCanceled: false }
          : item
      )
    );
    console.log("id", data);
    setSelectedItemId(id);
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

  const handleAttended = () => {
    if (selectedAttendedId && otpInput) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === selectedAttendedId
            ? {
                ...item,
                isAttended: true,
                isCanceled: false,
                isConfirmed: false,
              }
            : item
        )
      );
      setSelectedItemId(selectedAttendedId);
      setAttendedModal(false);
      setSelectedAttendedId("");
      setOtpInput("");
    } else {
      return Toast.show({
        type: "error",
        text1: "Please enter OTP first!",
      });
    }
  };

  const confirmAppointment = (id) => {
    handleConfirm(id);
  };

  const handleOnConfirm = (id) => {
    Alert.alert(
      "",
      "Are you sure you want to confirm this appointment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        { text: "Yes", onPress: () => confirmAppointment(id) },
      ],
      { cancelable: false }
    );
  };

  const onCancel = () => {
    setVisible(false);
    setTimeout(() => {
      props.navigation.navigate("cancelAppointment");
    }, 500);
  };

  const onReschedule = () => {
    setVisible(false);
    setTimeout(() => {
      props.navigation.navigate("rescheduleAppointment");
    }, 500);
  };

  return (
    <LinearGradient
      locations={[0, 0.5, 0.6]}
      colors={["#f6fbf4", "#d0f1f8", "#d0f2f8", "#f0f9f6"]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
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
              <SwitchIcon />
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
                  color: THEMES.colors.cyan,
                  fontFamily: THEMES.fontFamily.bold,
                  fontSize: THEMES.fonts.font20,
                }}
              >
                Hi James
              </Text>
            </View>
            <View
              style={{
                width: "20%",
                alignItems: "flex-end",
                flexDirection: "row",
              }}
            >
              <Bell />
              <Event
                onPress={() => props.navigation.navigate("createEvent")}
                style={{ marginLeft: moderateScale(17) }}
              />
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#77F0F9",
              padding: moderateScale(10),
              marginTop: moderateScale(14),
              borderRadius: moderateScale(16),
              margin: 0,
              shadowColor: "#ddd",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                backgroundColor: THEMES.colors.white,
                paddingHorizontal: moderateScale(12),
                paddingVertical: moderateScale(10),
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
                    style={{
                      color: THEMES.colors.cyan,
                      fontSize: THEMES.fonts.font12,
                      fontFamily: THEMES.fontFamily.medium,
                      paddingRight: moderateScale(10),
                    }}
                  >
                    Today’s Appointments{" "}
                  </Text>
                  <Right />
                </View>
                <Plus />
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
                        {colorData.map((block, index) => (
                          <View
                            key={index}
                            style={[
                              styles.block,
                              { backgroundColor: block.color },
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
                      9/12
                    </Text>
                    <Text
                      style={{
                        color: THEMES.colors.lightGrey,
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

            <View style={{ paddingTop: moderateScale(12) }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {countData.map((item, index) => {
                  return (
                    <View style={{ paddingRight: moderateScale(16) }}>
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
                    style={{
                      color: "#000",
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font10,
                    }}
                  >
                    11
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

          <View style={{ paddingTop: moderateScale(35) }}>
            <Text
              style={{
                color: "#000",
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
              }}
            >
              Next Appointment
            </Text>
            <View style={{ paddingTop: moderateScale(9) }}>
              <Carousel
                data={data}
                renderItem={renderItem}
                sliderWidth={340}
                itemWidth={340}
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
            <View style={styles.headerView}>
              <View style={styles.headerRow}>
                <View style={styles.w25}>
                  <Text style={styles.reviewCount}>4.8</Text>
                  <Text style={styles.reviewsText}>10 Reviews</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.w70}>
                  <ReviewComponent
                    reviewData={[
                      { stars: 5, count: 5, bgColor: "#FDD835" },
                      { stars: 4, count: 4, bgColor: "#fcc7b7" },
                      { stars: 3, count: 3, bgColor: "#6dae43" },
                      { stars: 2, count: 2, bgColor: "#21c2ce" },
                      { stars: 1, count: 1, bgColor: "#ab47bc" },
                    ]}
                    totalReviews={5}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        onBackdropPress={() => setVisible(false)}
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
              onPress={() => setVisible(false)}
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
        onBackdropPress={() => setAttendedModal(false)}
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
              <Button
                onPress={() => handleAttended()}
                title="Attended"
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 12,
    borderRadius: 2,
  },
  timeText: {
    marginTop: 5,
    color: "gray",
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
    fontFamily: THEMES.fontFamily.regular,
    color: "#b4b4b4",
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
});

export default Home;
