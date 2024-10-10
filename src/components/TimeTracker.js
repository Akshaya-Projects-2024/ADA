import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
import SwitchOn from "../assets/svg/switchOn.svg";
import SwitchOff from "../assets/svg/switchOff.svg";
import Strings from "../constants/strings";
import RadioSelected from "../assets/svg/radioSelected.svg";
import Radio from "../assets/svg/radio.svg";

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const TimeTracker = () => {
  const [selectedDays, setSelectedDays] = useState([]);

  const [selectedShiftType, setSelectedShiftType] = useState("full");
  const [selectedForAll, setSelectedForAll] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);
  const [pickerShift, setPickerShift] = useState(null);
  const [pickerType, setPickerType] = useState(null);
  const [pickerDay, setPickerDay] = useState(null);

  const [times, setTimes] = useState(
    days.reduce((acc, day) => {
      acc[day] = {
        shift1: { start: "", end: "" },
        shift2: { start: "", end: "" },
      };
      return acc;
    }, {})
  );

  const showDatePicker = (day, shift, type) => {
    setPickerDay(day);
    setPickerShift(shift);
    setPickerType(type);
    setPickerMode(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedTime = moment(date).format("HH:mm A");
    handleTimeChange(pickerDay, pickerShift, pickerType, formattedTime);
    hideDatePicker();
  };

  const toggleDay = (day) => {
    setSelectedDays((prevSelectedDays) => {
      const updatedDays = prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day];
      if (selectedForAll) {
        setTimes((prevTimes) => {
          const updatedTimes = { ...prevTimes };
          const referenceDay = updatedDays[0];
          const timeToCopy = times[referenceDay] || {
            shift1: { start: "", end: "" },
            shift2: { start: "", end: "" },
          };

          updatedDays.forEach((selectedDay) => {
            updatedTimes[selectedDay] = timeToCopy;
          });

          return updatedTimes;
        });
      }
      // Reset the times for the deselected day
      if (!updatedDays.includes(day)) {
        setTimes((prevTimes) => ({
          ...prevTimes,
          [day]: {
            shift1: { start: "", end: "" },
            shift2: { start: "", end: "" },
          },
        }));
      }

      return updatedDays;
    });
  };

  const handleTimeChange = (day, shift, type, value) => {
    setTimes((prevTimes) => {
      const updatedTimes = {
        ...prevTimes,
        [day]: {
          ...prevTimes[day],
          [shift]: {
            ...prevTimes[day][shift],
            [type]: value,
          },
        },
      };

      if (selectedForAll) {
        selectedDays.forEach((selectedDay) => {
          if (selectedDay !== day) {
            updatedTimes[selectedDay][shift][type] = value;
          }
        });
      }

      return updatedTimes;
    });
  };

  const RadioButton = ({ title, onPress, mode }) => {
    return (
      <Pressable
        style={styles.radioButtonContainer}
        activeOpacity={0.6}
        onPress={onPress}
      >
        {mode ? <RadioSelected /> : <Radio />}

        <Text
          style={[
            styles.radioButtonText,
            { color: mode ? THEMES.colors.black : THEMES.colors.lightGrey },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.workingDayText}>{Strings.workingDays}</Text>
      <View style={styles.weekDaysRow}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              {
                borderWidth: 1,
                backgroundColor: selectedDays.includes(day)
                  ? THEMES.colors.outrageousOrange
                  : THEMES.colors.pearl,
                borderColor: selectedDays.includes(day)
                  ? THEMES.colors.outrageousOrange
                  : THEMES.colors.darkGrey,
              },
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                {
                  color: selectedDays.includes(day)
                    ? THEMES.colors.white
                    : THEMES.colors.darkGrey,
                },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.workingTimeView}>
        <Text style={styles.workingTimeText}>{Strings.workingTime}</Text>
      </View>
      <View style={styles.radioButtonsContainer}>
        <View style={styles.radioButton}>
          <RadioButton
            mode={selectedShiftType === "full"}
            title={Strings.fullDay}
            onPress={() => setSelectedShiftType("full")}
          />
        </View>
        <View style={styles.radioButton}>
          <RadioButton
            mode={selectedShiftType === "shifts"}
            title={Strings.twoShiftInADay}
            onPress={() => setSelectedShiftType("shifts")}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingTop: moderateScale(32),
          justifyContent: "space-between",
          paddingBottom:
            selectedShiftType === "shifts"
              ? moderateScale(27)
              : moderateScale(39),
        }}
      >
        <Text style={styles.selectTimeText}>{Strings.selectTime}</Text>
        <Pressable
          style={styles.rowSameDay}
          onPress={() => setSelectedForAll(!selectedForAll)}
        >
          <Text style={styles.sameTimeForDayText}>
            {Strings.sameTimeForDay}
          </Text>
          {selectedForAll ? <SwitchOn /> : <SwitchOff />}
        </Pressable>
      </View>

      {selectedShiftType === "shifts" && (
        <View style={styles.sameTimeForDayView}>
          <Text style={styles.firstHalfText}>{Strings.firstHalf}</Text>
          <Text style={styles.firstHalfText}>{Strings.secondHalf}</Text>
        </View>
      )}

      <View style={styles.daysContainer}>
        {days.map((day) => (
          <View key={day} style={styles.dayContainer}>
            <View style={styles.dayCircle}>
              <Text style={styles.circleText}>{day}</Text>
            </View>

            <View style={styles.timeInputContainer}>
              <TouchableOpacity
                style={[
                  styles.timeInput1,
                  !selectedDays.includes(day) && styles.disabledInput,
                ]}
                onPress={() =>
                  selectedDays.includes(day) &&
                  showDatePicker(day, "shift1", "start")
                }
              >
                <Text
                  style={[
                    styles.timeText,
                    {
                      color: selectedDays.includes(day)
                        ? THEMES.colors.black
                        : THEMES.colors.lightSilver,
                    },
                  ]}
                >
                  {Strings.start}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    {
                      fontSize: THEMES.fonts.font12,
                      fontFamily: THEMES.fontFamily.semiBold,
                      color: selectedDays.includes(day)
                        ? THEMES.colors.black
                        : THEMES.colors.lightSilver,
                    },
                  ]}
                >
                  {times[day].shift1.start || "___:___"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timeInput,
                  !selectedDays.includes(day) && styles.disabledInput,
                ]}
                onPress={() =>
                  selectedDays.includes(day) &&
                  showDatePicker(day, "shift1", "end")
                }
              >
                <Text
                  style={[
                    styles.timeText,
                    {
                      color: selectedDays.includes(day)
                        ? THEMES.colors.black
                        : THEMES.colors.lightSilver,
                    },
                  ]}
                >
                  {Strings.close}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    {
                      fontSize: THEMES.fonts.font12,
                      fontFamily: THEMES.fontFamily.semiBold,
                      color: selectedDays.includes(day)
                        ? THEMES.colors.black
                        : THEMES.colors.lightSilver,
                    },
                  ]}
                >
                  {times[day].shift1.end || "___:___"}
                </Text>
              </TouchableOpacity>
            </View>

            {selectedShiftType === "shifts" && (
              <View style={styles.timeInputContainer}>
                <TouchableOpacity
                  style={[
                    styles.timeInput1,
                    !selectedDays.includes(day) && styles.disabledInput,
                  ]}
                  onPress={() => showDatePicker(day, "shift2", "start")}
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: selectedDays.includes(day)
                          ? THEMES.colors.black
                          : THEMES.colors.lightSilver,
                      },
                    ]}
                  >
                    {Strings.start}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      {
                        fontSize: THEMES.fonts.font12,
                        fontFamily: THEMES.fontFamily.semiBold,
                        color: selectedDays.includes(day)
                          ? THEMES.colors.black
                          : THEMES.colors.lightSilver,
                      },
                    ]}
                  >
                    {times[day].shift2.start || "___:___"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.timeInput,
                    !selectedDays.includes(day) && styles.disabledInput,
                  ]}
                  onPress={() => showDatePicker(day, "shift2", "end")}
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: selectedDays.includes(day)
                          ? THEMES.colors.black
                          : THEMES.colors.lightSilver,
                      },
                    ]}
                  >
                    {Strings.close}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      {
                        fontSize: THEMES.fonts.font12,
                        fontFamily: THEMES.fontFamily.semiBold,
                        color: selectedDays.includes(day)
                          ? THEMES.colors.black
                          : THEMES.colors.lightSilver,
                      },
                    ]}
                  >
                    {times[day].shift2.end || "___:___"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: moderateScale(32),
  },
  workingDayText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },

  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(10),
  },
  radioButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  daysContainer: {
    flex: 1,
  },
  dayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(40),
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
  disabledInput: {
    opacity: 0.7,
  },
  radioButtonContainer: { flex: 1, alignItems: "center", flexDirection: "row" },
  workingTimeView: {
    paddingTop: moderateScale(32),
    paddingBottom: moderateScale(16),
  },
  workingTimeText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
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
  firstHalfText: {
    fontFamily: THEMES.fontFamily.medium,
    color: THEMES.colors.black,
    fontSize: THEMES.fonts.font8,
    flex: 1,
  },
  radioButtonText: {
    fontSize: THEMES.fonts.font12,
    paddingLeft: moderateScale(8),
    fontFamily: THEMES.fontFamily.medium,
  },
});
export default TimeTracker;
