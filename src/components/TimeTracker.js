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
import { moderateScale } from "react-native-size-matters";
import { THEMES } from "../assets/theme/themes";
import SwitchOn from "../assets/svg/selectAllSwitchOn.svg";
import SwitchOff from "../assets/svg/switchOff.svg";
import Strings from "../constants/strings";
import RadioSelected from "../assets/svg/radioSelected.svg";
import Radio from "../assets/svg/radio.svg";
import { showToast } from "../utils/utils";

export const DAYS = [
  { key: "Mo", value: "Monday" },
  { key: "Tu", value: "Tuesday" },
  { key: "We", value: "Wednesday" },
  { key: "Th", value: "Thursday" },
  { key: "Fr", value: "Friday" },
  { key: "Sa", value: "Saturday" },
  { key: "Su", value: "Sunday" },
];

export const SHIFTS = { full: "full", shifts: "shifts" };

const TimeTracker = ({
  times,
  setTimes,
  selectedShiftType,
  setSelectedShiftType,
  selectedForAll,
  setSelectedForAll,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerShift, setPickerShift] = useState(null);
  const [pickerType, setPickerType] = useState(null);
  const [pickerDay, setPickerDay] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const showDatePicker = (day, shift, type) => {
    setPickerDay(day);
    setPickerShift(shift);
    setPickerType(type);
    setDatePickerVisibility(true);
    setSelectedTime(
      day[shift][type] ? moment(day[shift][type], "HH:mm").toDate() : new Date()
    );
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedTime = moment(date).format("HH:mm");
    if (pickerShift === "shift1" && pickerType === "start") {
      setMinDate(date);
    }
    handleTimeChange(pickerDay, pickerShift, pickerType, formattedTime);
  };

  const toggleDay = (day) => {
    const temp = [...times];
    const selectedDay = times.findIndex((it) => it.label === day.label);
    temp[selectedDay] = {
      ...day,
      selected: !day?.selected,
      ...(day?.selected ? { shift1: { start: "", end: "" } } : {}),
      ...(day?.selected ? { shift2: { start: "", end: "" } } : {}),
    };
    if (selectedForAll) {
      const firstItem = temp.find(
        (it) =>
          it?.shift1?.start ||
          it?.shift1?.end ||
          it?.shift2?.start ||
          it?.shift2?.end
      );
      if (firstItem) {
        const filteredItems = temp.filter(
          (it) =>
            (!it?.shift1?.start ||
              !it?.shift1?.end ||
              !it?.shift2?.start ||
              !it?.shift2?.end) &&
            it?.selected
        );
        for (let index = 0; index < filteredItems.length; index++) {
          const element = filteredItems[index];
          const indx = temp.findIndex((ite) => ite?.label === element?.label);
          if (!element?.shift1?.start) {
            element.shift1 = {
              ...element.shift1,
              start: firstItem?.shift1.start,
            };
          }
          if (!element?.shift1?.end) {
            element.shift1 = { ...element.shift1, end: firstItem?.shift1.end };
          }
          if (!element?.shift2?.start) {
            element.shift2 = {
              ...element.shift2,
              start: firstItem?.shift2.start,
            };
          }
          if (!element?.shift2?.end) {
            element.shift2 = { ...element.shift2, end: firstItem?.shift2.end };
          }
          temp[indx] = element;
        }
      }
    }
    setTimes(temp);
    // setSelectedDays((prevSelectedDays) => {
    //   const updatedDays = prevSelectedDays.includes(day)
    //     ? prevSelectedDays.filter((d) => d !== day)
    //     : [...prevSelectedDays, day];
    //   if (selectedForAll) {
    //     setTimes((prevTimes) => {
    //       const updatedTimes = { ...prevTimes };
    //       const referenceDay = updatedDays[0];
    //       const timeToCopy = times[referenceDay] || {
    //         shift1: { start: "", end: "" },
    //         shift2: { start: "", end: "" },
    //       };
    //       updatedDays.forEach((selectedDay) => {
    //         updatedTimes[selectedDay] = timeToCopy;
    //       });
    //       return updatedTimes;
    //     });
    //   }
    //   // Reset the times for the deselected day
    //   if (!updatedDays.includes(day)) {
    //     setTimes((prevTimes) => ({
    //       ...prevTimes,
    //       [day]: {
    //         shift1: { start: "", end: "" },
    //         shift2: { start: "", end: "" },
    //       },
    //     }));
    //   }
    //   return updatedDays;
    // });
  };

  const handleAllSelection = () => {
    const temp = [...times];
    if (!selectedForAll) {
      const firstItem = temp.find(
        (it) =>
          it?.shift1?.start ||
          it?.shift1?.end ||
          it?.shift2?.start ||
          it?.shift2?.end
      );
      if (firstItem) {
        const filteredItems = temp.filter(
          (it) =>
            (!it?.shift1?.start ||
              !it?.shift1?.end ||
              !it?.shift2?.start ||
              !it?.shift2?.end) &&
            it?.selected
        );
        for (let index = 0; index < filteredItems.length; index++) {
          const element = filteredItems[index];
          const indx = temp.findIndex((ite) => ite?.label === element?.label);
          // if (!element?.shift1?.start) {
          element.shift1 = {
            ...element.shift1,
            start: firstItem?.shift1.start,
          };
          // }
          // if (!element?.shift1?.end) {
          element.shift1 = { ...element.shift1, end: firstItem?.shift1.end };
          // }
          // if (!element?.shift2?.start) {
          element.shift2 = {
            ...element.shift2,
            start: firstItem?.shift2.start,
          };
          // }
          // if (!element?.shift2?.end) {
          element.shift2 = { ...element.shift2, end: firstItem?.shift2.end };
          // }
          temp[indx] = element;
        }
      }
    }
    // const temp = [...times];
    // if (selectedForAll) {
    //   for (let index = 0; index < temp.length; index++) {
    //     const element = temp[index];
    //     temp[index] = element;
    //   }
    // } else {
    //   for (let index = 0; index < temp.length; index++) {
    //     const element = temp[index];
    //     temp[index] = element;
    //   }
    // }
    setTimes(temp);
    setSelectedForAll(!selectedForAll);
  };

  const handleTimeChange = (day, shift, type, value) => {
    const temp = [...times];
    const selectedDay = times.findIndex((it) => it.label === day.label);
    temp[selectedDay] = {
      ...day,
      [shift]: { ...day[shift], [type]: value },
    };
    if (type == "start") {
      temp[selectedDay] = {
        ...temp[selectedDay],
        [shift]: { [type]: value, end: "" },
      };
    }
    if (selectedShiftType == SHIFTS.shifts && shift == "shift1") {
      temp[selectedDay] = {
        ...temp[selectedDay],
        shift2: { start: "", end: "" },
      };
    }

    if (
      (type === "end" && temp[selectedDay]?.[shift]?.start >= value) ||
      (shift === "shift2" &&
        type === "start" &&
        (temp[selectedDay]?.shift1?.start >= value ||
          temp[selectedDay]?.shift1?.end >= value))
    ) {
      hideDatePicker();
      showToast("error", Strings.timeError);
      return;
    }
    if (selectedForAll) {
      temp.map((item) => {
        item[shift][type] = null;
      });

      const filteredItems = temp.filter(
        (it) => !it[shift][type] && it?.selected
      );
      for (let index = 0; index < filteredItems?.length; index++) {
        const element = filteredItems[index];
        const indx = temp.findIndex((ite) => ite?.label === element?.label);
        element[shift] = { ...element[shift], [type]: value };
        if (type === "start") {
          element[shift] = { ...element[shift], ["end"]: "" };
        }
        if (selectedShiftType == SHIFTS.shifts && shift == "shift1") {
          element["shift2"] = { start: "", end: "" };
        }
        temp[indx] = element;
      }
    }
    setTimes(temp);
    hideDatePicker();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.workingDayText}>{Strings.workingDays}</Text>
        <View style={styles.weekDaysRow}>
          {times.map((day) => (
            <TouchableOpacity
              key={day?.label}
              style={[
                styles.dayButton,
                {
                  borderWidth: 1,
                  backgroundColor: day?.selected
                    ? THEMES.colors.outrageousOrange
                    : THEMES.colors.pearl,
                  borderColor: day?.selected
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
                    color: day?.selected
                      ? THEMES.colors.white
                      : THEMES.colors.darkGrey,
                  },
                ]}
              >
                {day?.label}
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
              mode={selectedShiftType === SHIFTS.full}
              title={Strings.fullDay}
              onPress={() => {
                setSelectedShiftType(SHIFTS.full);
              }}
            />
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              mode={selectedShiftType === SHIFTS.shifts}
              title={Strings.twoShiftInADay}
              onPress={() => {
                setSelectedShiftType(SHIFTS.shifts);
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingTop: moderateScale(32),
            justifyContent: "space-between",
            paddingBottom:
              selectedShiftType === SHIFTS.shifts
                ? moderateScale(27)
                : moderateScale(39),
          }}
        >
          <Text style={styles.selectTimeText}>{Strings.selectTime}</Text>
          <Pressable style={styles.rowSameDay} onPress={handleAllSelection}>
            <Text style={styles.sameTimeForDayText}>
              {Strings.sameTimeForDay}
            </Text>
            {selectedForAll ? <SwitchOn /> : <SwitchOff />}
          </Pressable>
        </View>

        {selectedShiftType === SHIFTS.shifts && (
          <View style={styles.sameTimeForDayView}>
            <Text style={styles.firstHalfText}>{Strings.firstHalf}</Text>
            <Text style={styles.firstHalfText}>{Strings.secondHalf}</Text>
          </View>
        )}

        <View style={styles.daysContainer}>
          {times.map((day) => (
            <View key={day?.label} style={styles.dayContainer}>
              <View style={styles.dayCircle}>
                <Text style={styles.circleText}>{day.label}</Text>
              </View>

              <View style={styles.timeInputContainer}>
                <TouchableOpacity
                  style={[
                    styles.timeInput1,
                    !day?.selected && styles.disabledInput,
                  ]}
                  onPress={() =>
                    day?.selected && showDatePicker(day, "shift1", "start")
                  }
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: day?.selected
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
                        color: day?.selected
                          ? THEMES.colors.black
                          : THEMES.colors.lightSilver,
                      },
                    ]}
                  >
                    {day.shift1.start || "___:___"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.timeInput,
                    !day?.selected && styles.disabledInput,
                  ]}
                  onPress={() =>
                    day?.selected && showDatePicker(day, "shift1", "end")
                  }
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: day?.selected
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
                        color: day?.selected
                          ? THEMES.colors.black
                          : THEMES.colors.lightSilver,
                      },
                    ]}
                  >
                    {day.shift1.end || "___:___"}
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedShiftType === SHIFTS.shifts && (
                <View style={styles.timeInputContainer}>
                  <TouchableOpacity
                    style={[
                      styles.timeInput1,
                      !day?.selected && styles.disabledInput,
                    ]}
                    onPress={() => showDatePicker(day, "shift2", "start")}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: day?.selected
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
                          color: day?.selected
                            ? THEMES.colors.black
                            : THEMES.colors.lightSilver,
                        },
                      ]}
                    >
                      {day.shift2.start || "___:___"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.timeInput,
                      !day?.selected && styles.disabledInput,
                    ]}
                    onPress={() => showDatePicker(day, "shift2", "end")}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: day?.selected
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
                          color: day?.selected
                            ? THEMES.colors.black
                            : THEMES.colors.lightSilver,
                        },
                      ]}
                    >
                      {day.shift2.end || "___:___"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        display="spinner"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedTime ? selectedTime : new Date()}
        minimumDate={minDate}
      />
    </>
  );
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

const styles = StyleSheet.create({
  container: {
    paddingTop: moderateScale(15),
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
