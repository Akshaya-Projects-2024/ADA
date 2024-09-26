import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Strings from "../../utils/strings";
import { Calendar } from "react-native-calendars";
import Button from "../../components/Button";

const CalendarScreen = (props) => {
  const { onBack, setEDate, setSDate, sDate, eDate } = props;

  console.log("eee", sDate, eDate)

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [selectingStartDate, setSelectingStartDate] = useState(true);

  //   const handleDateSelect = (day) => {
  //     if (selectingStartDate) {
  //       setStartDate(day.dateString);
  //     } else {
  //       setEndDate(day.dateString);
  //     }
  //     setSelectingStartDate(!selectingStartDate);
  //   };
  const handleDateSelect = (day) => {
    if (selectingStartDate) {
      setStartDate(day.dateString);
      setSDate(day.dateString);
      setEDate(null);
      setEndDate(null); // Reset end date when selecting a new start date
    } else {
      if (startDate && day.dateString >= startDate) {
        setEndDate(day.dateString);
        setEDate(day.dateString);
      } else {
        // Handle case where end date is before start date
        // For example, you can show an alert or handle it based on your UX design
        console.log("End date cannot be before start date");
      }
    }
    setSelectingStartDate(!selectingStartDate);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert the string to a Date object
    return date.toLocaleDateString("en-GB", {
      weekday: "short", // 'Wed'
      year: "numeric", // '2023'
      month: "short", // 'Dec'
      day: "numeric", // '20'
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <ImageBackground
            source={require("../../assets/images/bg.png")}
            resizeMode="cover"
            style={styles.backgroundImage}
          >
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: 278,
                backgroundColor: "#f23e91",
                opacity: 0.6,
              }}
            />
            <View style={{ height: 200 }}>
              <Header
                onBackPress={() => onBack()}
                showBack
                bgColor="transparent"
                title={"Select Date"}
                fontColor="#ffffff"
                arrowColor="#fff"
              />
            </View>
            <ScrollView style={{flex:1}} bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
            <View style={styles.contentView}>
              <View style={styles.timeInputContainer}>
                <View
                  style={styles.timeInput}
                  // onPress={() => setSelectingStartDate(true)}
                >
                  {startDate || sDate ? (
                    <>
                      <Text
                        style={[
                          styles.timeText,
                          {
                            color: "#737373",
                          },
                        ]}
                      >
                        Start Date
                      </Text>
                      <Text
                        style={[
                          styles.timeText,
                          {
                            fontSize: THEMES.fonts.font12,
                            fontFamily: THEMES.fontFamily.semiBold,
                            color: THEMES.colors.black,
                          },
                        ]}
                      >
                        {sDate ? formatDate(sDate) : formatDate(startDate)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.timeTextTitle}>+ Start Date</Text>
                  )}
                </View>
                <View
                  style={[styles.timeInput]}
                  // onPress={() => {
                  //   if (startDate) {
                  //     setSelectingStartDate(false);
                  //   }
                  // }}
                >
                  {endDate || eDate ? (
                    <>
                      <Text
                        style={[
                          styles.timeText,
                          {
                            color: "#737373",
                          },
                        ]}
                      >
                        End Date
                      </Text>
                      <Text
                        style={[
                          styles.timeText,
                          {
                            fontSize: THEMES.fonts.font12,
                            fontFamily: THEMES.fontFamily.semiBold,
                            color: THEMES.colors.black,
                          },
                        ]}
                      >
                        {eDate ? formatDate(eDate): formatDate(endDate)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.timeTextTitle}>+ End Date</Text>
                  )}
                </View>
              </View>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [startDate]: {
                    startingDay: true,
                    color: "red",
                    textColor: "green",
                  },
                  [endDate]: {
                    endingDay: true,
                    color: "red",
                    textColor: "green",
                  },
                  ...(!endDate &&
                    startDate && {
                      [startDate]: { color: "red", textColor: "green" },
                    }),
                }}
                theme={{
                  //   calendarBackground: "grey",
                  textSectionTitleColor: "#b6c1cd",
                  dayTextColor: "#2d4150",
                  todayTextColor: "red",
                  selectedDayTextColor: "white",
                  selectedDayBackgroundColor: "red",
                  //   arrowColor: "red",
                }}
              />
              <View style={{ paddingTop: moderateScale(20) }}>
                <Button title={"Confirm Date"} onPress={() => onBack()} />
              </View>
            </View>
            </ScrollView>
          </ImageBackground>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    height: 278,
  },
  timeInputContainer: {
    flexDirection: "row",
    marginVertical: moderateScale(20),

    height: 50,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 10,
    borderColor: THEMES.colors.iron,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  timeText: {
    fontSize: THEMES.fonts.font10,
    fontFamily: THEMES.fontFamily.regular,
    paddingBottom: moderateScale(2),
  },
  timeTextTitle: {
    color: "#FF6437",
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.medium,
  },
  contentView: {
    backgroundColor: THEMES.colors.bgColor,
    paddingHorizontal: moderateScale(20),
    width: "100%",
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    flex: 1,
    paddingVertical: moderateScale(30),
    paddingBottom: moderateScale(50),
  },
});

export default CalendarScreen;
