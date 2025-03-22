import React, { useEffect, useState } from "react";
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
  Linking,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Description from "../../assets/svg/codesandbox.svg";
import Location from "../../assets/svg/location.svg";
import Calendar from "../../assets/svg/calendar_event.svg";
import Call from "../../assets/svg/call.svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getAllEventsApi } from "../../redux-store/actions/events";
import { decryptService } from "../../utils/storageFunc";
import { screenWidth, vh, vw } from "../../utils/dimensions";
import { useIsFocused } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";



const UpcomingEvents = () => {
  const [eventData, setEventData] = useState([]);
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState([]);

  useEffect(() => {
    getEvents()
  }, [isFocused])

  const getEvents = async () => {
    let obj = {
      userId: await decryptService("userId"),
    };
    let res = await getAllEventsApi(obj);
    if (res?.data?.data?.length) {
      setEventData(res?.data?.data);
      setActiveIndex(new Array(res?.data?.data?.length).fill(0))
    }
  };

  const formatDateTime = (startdate, starttime) => {
    // Split the date string (format: "YYYY-MM-DD")
    const [year, month, day] = startdate.split("-");

    // Split the time string (format: "HH:mm:ss")
    const [hoursStr, minutesStr] = starttime.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr; // Already in correct format

    // Determine AM or PM and convert to 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12; // Convert "0" hour to "12" for midnight/noon

    // Array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Build and return the formatted string
    return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}, ${hours}.${minutes} ${ampm}`;
  }

  const paginationDots = (list, itemIndex) => {
    return (
      <View style={{
        flexDirection: "row",
        marginTop: 10,
        alignSelf: "center",
      }}>
        {list.map((_, i) => {
          return <View
            style={[
              {
                borderRadius: 5,
                marginHorizontal: 3,
                backgroundColor: i == activeIndex[itemIndex] ? "#FC6532" : "#E7C5B3",
                width: i == activeIndex[itemIndex] ? 20 : 12,
                height: 7,
              }, // Active dot color
            ]}
          />
        })}
      </View>
    );
  };



  const renderItem = ({ item, index }) => {
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
          paddingBottom: moderateScale(15),
          paddingHorizontal: moderateScale(13),
          marginBottom: moderateScale(20),
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Carousel
            data={item?.documentlist}
            renderItem={({ item }) => (
              <Image
                resizeMode="cover"
                style={{
                  borderRadius: 11,
                  width: "100%",
                  height: vh(150),
                  borderColor: THEMES.colors.lightGrey,
                  borderWidth: 1,
                }}
                source={{ uri: item?.url }}
              />
            )}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.9}
            onSnapToItem={(x) => {
              const temp = [...activeIndex];
              temp[index] = x;
              setActiveIndex(temp)
            }} // Track active slide index
          />

          {paginationDots(item?.documentlist, index)}
        </View>


        <View
          style={{
            paddingTop: moderateScale(17),
            paddingHorizontal: moderateScale(16),
          }}
        ></View>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: THEMES.fontFamily.bold,
            fontSize: THEMES.fonts.font12,
            color: THEMES.colors.black,
          }}
        >
          {item.name}
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
              {formatDateTime(item.startdate, item.starttime)}
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
              {item.description}
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
                {item.location}
              </Text>
            </View>
            <View style={{ width: "30%", alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `tel:${item?.contact}`
                  )
                }
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const EmptyContentView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "#000",
            fontSize: moderateScale(16),
            fontWeight: 500,
          }}
        >
          Oops! No events available at this moment.
        </Text>
      </View>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: THEMES.colors.bgColor }}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={"Upcoming events"}
          fontColor="#EC559C"
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
          {
            eventData?.length ? <FlatList
              showsVerticalScrollIndicator={false}
              data={eventData}
              bounces={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            /> : EmptyContentView()
          }

        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpcomingEvents;
