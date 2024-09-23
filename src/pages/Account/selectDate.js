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
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Strings from "../../utils/strings";
import { Calendar } from "react-native-calendars";
import Button from "../../components/Button";

const SelectDate = (props) => {
  const { colors, fontFamily, fonts } = THEMES;
  const [startDate, setStartDate] = useState(null);
  console.log("startDate", startDate);

  const [endDate, setEndDate] = useState(null);
  console.log("endDate", endDate);
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
      setEndDate(null); // Reset end date when selecting a new start date
    } else {
      if (startDate && day.dateString >= startDate) {
        setEndDate(day.dateString);
      } else {
        // Handle case where end date is before start date
        // For example, you can show an alert or handle it based on your UX design
        console.log("End date cannot be before start date");
      }
    }
    setSelectingStartDate(!selectingStartDate);
  };
  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          showBack
          bgColor="transparent"
          title={"Select Date"}
          fontColor="#ffffff"
        />

        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: THEMES.colors.bgColor,
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <View style={styles.timeInputContainer}>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setSelectingStartDate(true)}
            >
              {startDate ? (
                <>
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: THEMES.colors.black,
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
                    {startDate}
                  </Text>
                </>
              ) : (
                <Text style={styles.timeTextTitle}>+ Start Date</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeInput]}
              onPress={() => {
                if (startDate) {
                  setSelectingStartDate(false);
                }
              }}
            >
              {endDate ? (
                <>
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: THEMES.colors.black,
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
                    {endDate}
                  </Text>
                </>
              ) : (
                <Text style={styles.timeTextTitle}>+ End Date</Text>
              )}
            </TouchableOpacity>
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
          <Button title={"Confirm Date"} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  timeInputContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 20,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: THEMES.colors.iron,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  timeText: {
    color: THEMES.colors.darkGrey,
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
  },
  timeTextTitle: {
    color: "#d9705b",
    fontSize: THEMES.fonts.font10,
    fontFamily: THEMES.fontFamily.semiBold,
  },
});

export default SelectDate;
