import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Description from "../../assets/svg/codesandbox.svg";
import Location from "../../assets/svg/location.svg";
import Calendar from "../../assets/svg/calendar_event.svg";
import Call from "../../assets/svg/call.svg";

const DATA = [
  {
    id: 1,
    date: "1 July, 05:30 PM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ",
    location: "Gadkari hall, Thane",
  },
  {
    id: 1,
    date: "1 July, 05:30 PM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ",
    location: "Gadkari hall, Thane",
  },
];

const UpcomingEvents = () => {
  const renderItem = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#fff",
          shadowColor: THEMES.colors.lightGrey,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          overflow: "hidden",
          borderRadius: 12,
          paddingVertical: moderateScale(15),
          paddingHorizontal: moderateScale(13),
          marginBottom: moderateScale(12),
        }}
      >
        <Image
          style={{
            borderRadius: 11,
            borderColor: THEMES.colors.lightGrey,
            borderWidth: 1,
            alignSelf: "center",
          }}
          source={require("../../assets/images/banner.png")}
        />
        <View
          style={{
            paddingTop: moderateScale(17),
            paddingHorizontal: moderateScale(16),
          }}
        ></View>
        <Text
          style={{
            fontFamily: THEMES.fontFamily.bold,
            fontSize: THEMES.fonts.font12,
            color: THEMES.colors.black,
          }}
        >
          Event name
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: moderateScale(10),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "10%" }}>
            <Calendar />
          </View>
          <View style={{ width: "85%" }}>
            <Text
              style={{
                fontFamily: THEMES.fontFamily.bold,
                fontSize: THEMES.fonts.font12,
                color: THEMES.colors.black,
              }}
            >
              1 July, 05:30 PM
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: moderateScale(10),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "10%" }}>
            <Description />
          </View>
          <View style={{ width: "85%" }}>
            <Text
              style={{
                fontFamily: THEMES.fontFamily.medium,
                fontSize: THEMES.fonts.font12,
                color: "#323232",
                lineHeight: moderateScale(20),
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: moderateScale(10),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "10%" }}>
            <Location />
          </View>
          <View
            style={{ width: "85%", flexDirection: "row", alignItems: "center" }}
          >
            <View style={{ width: "60%" }}>
              <Text
                style={{
                  fontFamily: THEMES.fontFamily.medium,
                  fontSize: THEMES.fonts.font12,
                  color: THEMES.colors.cyan,
                }}
              >
                Gadkari hall, Thane
              </Text>
            </View>
            <View style={{ width: "30%", alignItems: "flex-end" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                  backgroundColor: "#00BBC8",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 0,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Call />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={"Upcoming events"}
        fontColor="#FF6437"
        showBack
        bgColor="transparent"
      />
      <View
        style={{
          paddingHorizontal: moderateScale(16),
          flex: 1,
          backgroundColor: THEMES.colors.bgColor,
        }}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          data={DATA}
          bounces={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default UpcomingEvents;
