import React, { useEffect, useState } from "react";
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
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import Checked from "../../assets/svg/checked.svg";
import UnChecked from "../../assets/svg/unchecked.svg";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { contextValue } from "../../components/Loader";
import { getHolidayData } from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { DAYS } from "../../components/TimeTracker";
import { showToast } from "../../utils/utils";
import InputField from "../../components/InputField";
import Calender from "../../assets/svg/calendar_event.svg";
import ClockSvg from "../../assets/svg/ClockSvg";

const SingleSelectCheckBox = ({ title, onPress, mode }) => {
  return (
    <Pressable
      style={styles.radioButtonContainer}
      activeOpacity={0.6}
      onPress={onPress}
    >
      {mode ? <Checked /> : <UnChecked />}
      <Text style={styles.radioButtonText}>{title}</Text>
    </Pressable>
  );
};

const MarkHoliday = () => {
  const [holidayDays, setHolidayDays] = useState([]); // Initially, no holidays are selected
  const [holidayType, setHolidayType] = useState("oneDay");
  const [applyForAllDays, setApplyForAllDays] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerDay, setPickerDay] = useState(null);
  const [pickerType, setPickerType] = useState(null);
  const [times, setTimes] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startTimeVisible, setStartTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    contextValue?.setLoader(true);
    const daysz = DAYS;
    try {
      const userId = await decryptService("userId");
      const params = { provider_id: userId };
      const res = await getHolidayData(params);
      if (res?.status === 200) {
        // console.log("🚀 ~ initData ~ res:", res?.data?.data);
      }
      const currentDay = new Date().getDay();
      const removedData = daysz.slice(currentDay - 1);
      const newDates = [...removedData, ...daysz.slice(0, currentDay - 1)];
      setTimes(
        newDates.map((it) => {
          return {
            label: it.key,
            start: "",
            end: "",
            selected: false,
            value: it.value,
          };
        })
      );
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message || "Something went wrong");
    }
  };

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

  const handleStartDate = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setStartDate(formattedDate);
    hideStartDate();
  };

  const hideStartDate = () => {
    setStartDateVisible(false);
  };

  const handleStartTime = (date) => {
    const formattedDate = moment(date).format("HH:mm");
    setStartTime(formattedDate);
    hideStartTime();
  };

  const hideStartTime = () => {
    setStartTimeVisible(false);
  };

  const handleEndDate = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setEndDate(formattedDate);
    hideEndDate();
  };

  const hideEndDate = () => {
    setEndDateVisible(false);
  };

  const handleEndTime = (date) => {
    const formattedDate = moment(date).format("HH:mm");
    setEndTime(formattedDate);
    hideEndTime();
  };

  const hideEndTime = () => {
    setEndTimeVisible(false);
  };

  const handleTimeChange = (day, type, time) => {
    const temp = [...holidayDays];
    const selectedDay = holidayDays.findIndex((it) => it.label === day.label);
    temp[selectedDay] = {
      ...day,
      [type]: time,
    };
    setHolidayDays(temp);
  };

  const toggleDay = (day) => {
    const temp = [...times];
    const op = [...holidayDays];
    const selectedDay = times?.findIndex((it) => it.label === day.label);
    temp[selectedDay] = {
      ...day,
      selected: !day?.selected,
      ...(day?.selected ? { start: "", end: "" } : {}),
    };
    const selectedDayOp = op?.findIndex((it) => it.label === day.label);
    if (temp[selectedDay].selected) {
      op.push(temp[selectedDay]);
    } else {
      op.splice(selectedDayOp, 1);
    }
    setTimes(temp);
    setHolidayDays(op);
    // setHolidayDays((prevHolidayDays) => {
    //   const updatedDays = prevHolidayDays.includes(day)
    //     ? prevHolidayDays.filter((d) => d !== day) // Remove day if it was a holiday
    //     : [...prevHolidayDays, day]; // Add day as a holiday

    //   // Sort updatedDays according to predefined order in days array
    //   const sortedDays = updatedDays.sort(
    //     (a, b) => times?.indexOf(a) - times?.indexOf(b)
    //   );

    //   // Apply default times if "All Day" is enabled
    //   if (applyForAllDays) {
    //     setTimes((prevTimes) => {
    //       const updatedTimes = { ...prevTimes };
    //       sortedDays.forEach((selectedDay) => {
    //         updatedTimes[selectedDay] = { start: "10:00 AM", end: "07:00 PM" };
    //       });
    //       return updatedTimes;
    //     });
    //   }

    //   return sortedDays;
    // });
  };

  const handleToggleAllDay = () => {
    setApplyForAllDays((preValue) => {
      return !preValue;
    });

    //   // Apply default times to all selected days if "All Day" is enabled
    //   if (!applyForAllDays) {
    //     setTimes((prevTimes) => {
    //       const updatedTimes = { ...prevTimes };
    //       holidayDays.forEach((day) => {
    //         updatedTimes[day] = { start: "10:00 AM", end: "07:00 PM" };
    //       });
    //       return updatedTimes;
    //     });
    //   }
  };

  const onSubmit = async () => {
    try {
      contextValue?.setLoader(true);
      const userId = await decryptService("userId");
      const holidayParams = {
        provider_id: userId,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        isfullday: applyForAllDays,
        notes: "Scheduled maintenance",
      };
      const longHolidayParams = {
        provider_id: userId,
        note: "Holiday schedule for provider",
        weeklyholiday: [
          {
            day_of_week: "Monday",
            start_time: "09:00",
            end_time: "17:00",
            is_available: false,
          },
          {
            day_of_week: "Wednesday",
            start_time: "10:00",
            end_time: "16:00",
            is_available: false,
          },
        ],
      };
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              {times?.map((day) => (
                <TouchableOpacity
                  key={day?.label}
                  style={[
                    styles.dayButton,
                    {
                      borderWidth: 1,
                      backgroundColor: day?.selected
                        ? THEMES.colors.pearl
                        : THEMES.colors.outrageousOrange,
                      borderColor: day?.selected
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
                        color: day?.selected
                          ? THEMES.colors.darkGrey
                          : THEMES.colors.white,
                      },
                    ]}
                  >
                    {day?.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingTop: moderateScale(32),
                justifyContent: "space-between",
                paddingBottom: moderateScale(39),
              }}
            >
              <Text style={styles.selectTimeText}>{Strings.selectTime}</Text>
              <Pressable style={styles.rowSameDay} onPress={handleToggleAllDay}>
                <Text style={styles.sameTimeForDayText}>All Day</Text>
                {applyForAllDays ? <SwitchOn /> : <SwitchOff />}
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              {holidayDays?.length > 0 && (
                <>
                  {holidayDays?.map((day, index) => (
                    <View
                      key={`${day?.label}_${index}`}
                      style={styles.dayContainer}
                    >
                      <View style={styles.dayCircle}>
                        <Text style={styles.circleText}>{day?.label}</Text>
                      </View>
                      <View style={styles.timeInputContainer}>
                        <TouchableOpacity
                          style={[
                            styles.timeInput1,
                            // !holidayDays.includes(day) && styles.disabledInput,
                          ]}
                          onPress={() =>
                            // holidayDays.includes(day) &&
                            showDatePicker(day, "start")
                          }
                          disabled={applyForAllDays}
                        >
                          <Text
                            style={[
                              styles.timeText,
                              {
                                color:
                                  // holidayDays.includes(day)    ?
                                  THEMES.colors.black,
                                // : THEMES.colors.lightSilver,
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
                                color:
                                  //  holidayDays.includes(day)?
                                  THEMES.colors.black,
                                // : THEMES.colors.lightSilver,
                              },
                            ]}
                          >
                            {day?.start || "___:___"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.timeInput]}
                          onPress={() => showDatePicker(day, "end")}
                          disabled={applyForAllDays}
                        >
                          <Text
                            style={[
                              styles.timeText,
                              {
                                color: THEMES.colors.black,
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
                                color: THEMES.colors.black,
                              },
                            ]}
                          >
                            {day?.end || "___:___"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}
              <Text
                style={[
                  styles.timeText,
                  {
                    fontSize: THEMES.fonts.font14,
                    fontFamily: THEMES.fontFamily.semiBold,
                    color: THEMES.colors.black,
                    marginBottom: moderateScale(10),
                  },
                ]}
              >
                {Strings.longHoliday}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  marginBottom: moderateScale(32),
                  gap: moderateScale(10),
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.timeText,
                    {
                      fontSize: THEMES.fonts.font14,
                      fontFamily: THEMES.fontFamily.semiBold,
                      color: THEMES.colors.black,
                      minWidth: "10%",
                    },
                  ]}
                >
                  {Strings.start}
                </Text>
                <Pressable
                  style={styles.daysContainer}
                  onPress={() => {
                    setStartDateVisible(true);
                  }}
                >
                  <InputField
                    label={Strings.startDate}
                    placeholderText={"--"}
                    value={startDate ?? null}
                    rightIcon={<Calender />}
                    type="small"
                    inputStyle={styles.startDateInput}
                    editable={false}
                    fontScaling={false}
                  />
                </Pressable>
                <Pressable
                  style={styles.daysContainer}
                  onPress={() => {
                    setStartTimeVisible(true);
                  }}
                >
                  <InputField
                    label={Strings.time}
                    placeholderText={"--"}
                    value={startTime ?? null}
                    type="small"
                    rightIcon={<ClockSvg stroke={THEMES.colors.svgColor} />}
                    inputStyle={styles.startDateInput}
                    editable={false}
                    fontScaling={false}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  gap: moderateScale(10),
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.timeText,
                    {
                      fontSize: THEMES.fonts.font14,
                      fontFamily: THEMES.fontFamily.semiBold,
                      color: THEMES.colors.black,
                      minWidth: "10%",
                    },
                  ]}
                >
                  {Strings.end}
                </Text>
                <Pressable
                  style={styles.daysContainer}
                  onPress={() => {
                    setEndDateVisible(true);
                  }}
                >
                  <InputField
                    label={Strings.startDate}
                    placeholderText={"--"}
                    value={endDate ?? null}
                    rightIcon={<Calender />}
                    type="small"
                    inputStyle={styles.startDateInput}
                    editable={false}
                    fontScaling={false}
                  />
                </Pressable>
                <Pressable
                  style={styles.daysContainer}
                  onPress={() => {
                    setEndTimeVisible(true);
                  }}
                >
                  <InputField
                    label={Strings.time}
                    placeholderText={"--"}
                    value={endTime ?? null}
                    type="small"
                    rightIcon={<ClockSvg stroke={THEMES.colors.svgColor} />}
                    inputStyle={styles.startDateInput}
                    editable={false}
                    fontScaling={false}
                  />
                </Pressable>
              </View>
              {holidayDays?.length > 0 ||
                (startDate && startTime && endDate && endTime && (
                  <View style={styles.submitButton}>
                    <Button title={Strings.submit} onPress={onSubmit} />
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={startDateVisible}
          mode="date"
          onConfirm={handleStartDate}
          onCancel={hideStartDate}
          minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={endDateVisible}
          mode="date"
          onConfirm={handleEndDate}
          onCancel={hideEndDate}
          minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={startTimeVisible}
          mode="time"
          onConfirm={handleStartTime}
          onCancel={hideStartTime}
        />
        <DateTimePickerModal
          isVisible={endTimeVisible}
          mode="time"
          onConfirm={handleEndTime}
          onCancel={hideEndTime}
        />
      </View>
    </SafeAreaView>
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
    marginVertical: moderateScale(20),
  },
  startDateInput: {
    flex: 1,
    fontSize: THEMES.fonts.font12,
    // marginStart: moderateScale(16),
    // marginEnd: moderateScale(8),
  },
});

export default MarkHoliday;
