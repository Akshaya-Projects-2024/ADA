import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Carousel from "react-native-snap-carousel";
import { THEMES } from "../../assets/theme/themes";
import { moderateScale } from "react-native-size-matters";
import ArrowRight from "../../assets/svg/arrow-right-white.svg";
import Calendar from "../../assets/svg/calendar-white.svg";
import Clock from "../../assets/svg/clock.svg";
import SwitchIcon from "../../assets/svg/switch.svg";
import Bell from "../../assets/svg/bell.svg";
import Event from "../../assets/svg/event.svg";
import Search from "../../assets/svg/search.svg";
import Trainer from "../../assets/svg/trainer.svg";
import Walker from "../../assets/svg/walker.svg";
import Behaviourist from "../../assets/svg/behaviour.svg";
import Groomer from "../../assets/svg/groomer.svg";
const { width: screenWidth } = Dimensions.get("window");

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
    type: "data",
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
    type: "Banner",
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
    type: "Banner",
  },
];

const services = [
  { id: 1, title: "Trainer", icon: <Trainer /> },
  { id: 2, title: "Behaviourist", icon: <Behaviourist /> },
  { id: 3, title: "Pet Walker", icon: <Walker /> },
  { id: 4, title: "Groomer", icon: <Groomer /> },
];

const Data = [
  {
    id: 1,
    title: "Home Remedies for Tick Removal",
    name: "Kartik Kumar",
  },
  {
    id: 2,
    title: "Problems Faced by Pets due to Ticks.",
    name: "Soni Kapoor",
  },
  {
    id: 3,
    title: "Home Remedies for Tick Removal",
    name: "Kartik Kumar",
  },
  {
    id: 4,
    title: "Problems Faced by Pets due to Ticks.",
    name: "Soni Kapoor",
  },
];

const { width } = Dimensions.get("window");

const ParentHome = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderTrendingItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate("trendDetail")}
        style={{ flexDirection: "column" }}
      >
        <View
          style={[
            styles.card,
            { marginLeft: index === 0 ? 0 : moderateScale(20) },
          ]}
        >
          <Image
            resizeMode="cover"
            source={require("../../assets/images/dogImg.png")}
            style={{ width: "100%" }}
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
            numberOfLines={2}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              color: THEMES.colors.black,
              fontSize: THEMES.fonts.font12,
              paddingHorizontal: moderateScale(10),
              paddingVertical: moderateScale(8),
            }}
          >
            Home Remedies for Tick Removal
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              color: THEMES.colors.darkGrey,
              fontSize: THEMES.fonts.font12,
              paddingHorizontal: moderateScale(10),
              paddingTop: moderateScale(3),
              paddingBottom: moderateScale(5),
            }}
          >
            Kartik Kumar
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={`${item?.id}_${index}`}>
        {item.type == "Banner" ? (
          <TouchableOpacity
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
            <Image
              style={{
                borderRadius: 11,
                width: "90%",
                borderColor: THEMES.colors.lightGrey,
                borderWidth: 1,
              }}
              source={require("../../assets/images/banner.png")}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
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
                      source={require("../../assets/images/profileImg.png")}
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
                    Dr. Shreeram Laghu
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
                    Services Provided
                  </Text>

                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: THEMES.fontFamily.semiBold,
                      fontSize: THEMES.fonts.font12,
                      paddingTop: moderateScale(5),
                    }}
                  >
                    OTP: 2457
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
                  Sun, 12 September
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
                  11:00 - 12:00 AM
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
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

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.white }}>
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
                color: "#EC407A",
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
        <Carousel
          data={appointmentData}
          renderItem={renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth * 0.9}
          onSnapToItem={(index) => setActiveIndex(index)} // Track active slide index
        />
        {paginationDots()}
        <View>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginTop: moderateScale(30),
            }}
          >
            <TouchableOpacity
              onPress={() => props.navigation.navigate("search")}
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
            </TouchableOpacity>
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
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={`${item?.id}_${index}`}
                style={styles.itemContainer}
              >
                <View style={styles.iconContainer}>{Icon}</View>
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
            data={Data}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={renderTrendingItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </View>
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
});

export default ParentHome;
