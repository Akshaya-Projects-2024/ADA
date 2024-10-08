import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SwitchOn from "../../assets/svg/switchOn.svg";
import SwitchOff from "../../assets/svg/switchOff.svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Checked from "../../assets/svg/checked.svg";
import UnChecked from "../../assets/svg/unchecked.svg";
import Button from "../../components/Button";

// Predefined order of days
const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MarkHoliday = () => {
  const [holidayDays, setHolidayDays] = useState([]); // Initially, no holidays are selected
  const [holidayType, setHolidayType] = useState("oneDay");
  const [applyForAllDays, setApplyForAllDays] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerDay, setPickerDay] = useState(null);
  const [pickerType, setPickerType] = useState(null);
  const [times, setTimes] = useState(
    days.reduce((acc, day) => {
      acc[day] = { start: "", end: "" };
      return acc;
    }, {})
  );

  const showDatePicker = (day, type) => {
    setPickerDay(day);
    setPickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedTime = moment(date).format("HH:mm A");
    handleTimeChange(pickerDay, pickerType, formattedTime);
    hideDatePicker();
  };

  const handleTimeChange = (day, type, time) => {
    setTimes((prevTimes) => ({
      ...prevTimes,
      [day]: {
        ...prevTimes[day],
        [type]: time,
      },
    }));
  };

  const toggleDay = (day) => {
    setHolidayDays((prevHolidayDays) => {
      const updatedDays = prevHolidayDays.includes(day)
        ? prevHolidayDays.filter((d) => d !== day) // Remove day if it was a holiday
        : [...prevHolidayDays, day]; // Add day as a holiday

      // Sort updatedDays according to predefined order in days array
      const sortedDays = updatedDays.sort(
        (a, b) => days.indexOf(a) - days.indexOf(b)
      );

      // Apply default times if "All Day" is enabled
      if (applyForAllDays) {
        setTimes((prevTimes) => {
          const updatedTimes = { ...prevTimes };
          sortedDays.forEach((selectedDay) => {
            updatedTimes[selectedDay] = { start: "10:00 AM", end: "07:00 PM" };
          });
          return updatedTimes;
        });
      }

      return sortedDays;
    });
  };

  const handleToggleAllDay = () => {
    setApplyForAllDays(!applyForAllDays);

    // Apply default times to all selected days if "All Day" is enabled
    if (!applyForAllDays) {
      setTimes((prevTimes) => {
        const updatedTimes = { ...prevTimes };
        holidayDays.forEach((day) => {
          updatedTimes[day] = { start: "10:00 AM", end: "07:00 PM" };
        });
        return updatedTimes;
      });
    }
  };

  const SingleSelectCheckBox = ({ title, onPress, mode }) => {
    return (
      <Pressable
        style={styles.radioButtonContainer}
        activeOpacity={0.6}
        onPress={onPress}
      >
        {mode ? <Checked></Checked> : <UnChecked />}

        <Text style={styles.radioButtonText}>{title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={Strings.markHoliday}
        showBack
        bgColor="transparent"
        fontColor={THEMES.colors.black}
      />
      <View style={styles.mainView}>
        <ScrollView
          style={styles.daysContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.radioButtonsContainer}>
            <SingleSelectCheckBox
              mode={holidayType === "oneDay"}
              title={"One Day"}
              onPress={() => setHolidayType("oneDay")}
            />
            <SingleSelectCheckBox
              mode={holidayType === "everyWeek"}
              title={"Every Week"}
              onPress={() => setHolidayType("everyWeek")}
            />
          </View>
          <Text style={styles.workingDayText}>Select day</Text>
          <View style={styles.weekDaysRow}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  {
                    backgroundColor: holidayDays.includes(day)
                      ? THEMES.colors.pearl
                      : THEMES.colors.outrageousOrange,
                    borderColor: holidayDays.includes(day)
                      ? THEMES.colors.darkGrey
                      : THEMES.colors.outrageousOrange,
                  },
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: holidayDays.includes(day)
                        ? THEMES.colors.darkGrey
                        : THEMES.colors.white,
                    },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: moderateScale(32),
              justifyContent: "space-between",
              paddingBottom:
                holidayType === "everyWeek"
                  ? moderateScale(27)
                  : moderateScale(39),
            }}
          >
            <Text style={styles.selectTimeText}>{Strings.selectTime}</Text>
            <Pressable style={styles.rowSameDay} onPress={handleToggleAllDay}>
              <Text style={styles.sameTimeForDayText}>All Day</Text>
              {applyForAllDays ? <SwitchOn /> : <SwitchOff />}
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            {holidayDays.length > 0 && (
              <>
                {holidayDays.map((day) => (
                  <View key={day} style={styles.dayContainer}>
                    <View style={styles.dayCircle}>
                      <Text style={styles.circleText}>{day}</Text>
                    </View>
                    <View style={styles.timeInputContainer}>
                      <TouchableOpacity
                        style={[
                          styles.timeInput1,
                          !holidayDays.includes(day) && styles.disabledInput,
                        ]}
                        onPress={() =>
                          holidayDays.includes(day) &&
                          showDatePicker(day, "start")
                        }
                        disabled={applyForAllDays}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            {
                              color: holidayDays.includes(day)
                                ? THEMES.colors.black
                                : THEMES.colors.lightSilver,
                            },
                          ]}
                        >
                          {Strings.from}
                        </Text>
                        <Text
                          style={[
                            styles.timeText,
                            {
                              fontSize: THEMES.fonts.font12,
                              fontFamily: THEMES.fontFamily.semiBold,
                              color: holidayDays.includes(day)
                                ? THEMES.colors.black
                                : THEMES.colors.lightSilver,
                            },
                          ]}
                        >
                          {times[day].start || "___:___"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.timeInput,
                          !holidayDays.includes(day) && styles.disabledInput,
                        ]}
                        onPress={() =>
                          holidayDays.includes(day) &&
                          showDatePicker(day, "end")
                        }
                        disabled={applyForAllDays}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            {
                              color: holidayDays.includes(day)
                                ? THEMES.colors.black
                                : THEMES.colors.lightSilver,
                            },
                          ]}
                        >
                          {Strings.to}
                        </Text>
                        <Text
                          style={[
                            styles.timeText,
                            {
                              fontSize: THEMES.fonts.font12,
                              fontFamily: THEMES.fontFamily.semiBold,
                              color: holidayDays.includes(day)
                                ? THEMES.colors.black
                                : THEMES.colors.lightSilver,
                            },
                          ]}
                        >
                          {times[day].end || "___:___"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
            {holidayDays.length > 0 && (
              <View style={styles.submitButton}>
                <Button title={Strings.submit} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  selectTimeText: {
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
  },
  rowSameDay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sameTimeForDayText: {
    fontFamily: THEMES.fontFamily.semiBold,
    color: THEMES.colors.cyan,
    fontSize: THEMES.fonts.font12,
    paddingRight: moderateScale(6),
  },
  sameTimeForDayView: {
    flexDirection: "row",
    marginLeft: moderateScale(50),
    marginVertical: moderateScale(9),
  },
  workingDayText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    paddingTop: moderateScale(34),
  },
  mainView: {
    flex: 1,
    paddingTop: moderateScale(20),
    paddingHorizontal: moderateScale(20),
  },
  radioButtonContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 20,
  },
  daysContainer: {
    flex: 1,
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(40),
  },
  radioButtonText: {
    fontSize: THEMES.fonts.font12,
    paddingLeft: moderateScale(8),
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.black,
  },
  radioButtonsContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },

  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(10),
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    borderWidth: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: THEMES.colors.white,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    borderWidth: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: THEMES.colors.white,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font10,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    backgroundColor: THEMES.colors.outrageousOrange,
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  circleText: {
    color: THEMES.colors.white,
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font12,
  },
  timeInputContainer: {
    flex: 1,
    flexDirection: "row",
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 2,
    borderColor: THEMES.colors.iron,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  timeInput1: {
    flex: 1,
    marginHorizontal: 2,
    borderColor: THEMES.colors.iron,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  timeText: {
    color: THEMES.colors.darkGrey,
    fontSize: THEMES.fonts.font8,
    fontFamily: THEMES.fontFamily.medium,
  },
  submitButton: {
    width: "100%",
    alignSelf: "center",
    marginBottom: moderateScale(20),
  },
});

export default MarkHoliday;
