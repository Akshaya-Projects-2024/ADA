import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
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
import {
  getHolidayData,
  getWeeklyHolidayData,
  setHolidayData,
  setWeeklyHolidayData,
} from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { DAYS } from "../../components/TimeTracker";
import { showToast, validArray } from "../../utils/utils";
import InputField from "../../components/InputField";
import Calender from "../../assets/svg/calendar_event.svg";
import ClockSvg from "../../assets/svg/ClockSvg";
import Dialog from "../../components/Dialog";
import { useIsFocused } from "@react-navigation/native";

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
const WHOLE_DAY = { start: "10:00 AM", end: "07:00 PM" };
const EMPTY_DAY = { start: "", end: "" };
const WEEKLY = "everyWeek";
const ONE_DAY = "oneDay";
const MarkHoliday = () => {
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const [holidayDays, setHolidayDays] = useState([]); // Initially, no holidays are selected
  const [holidayType, setHolidayType] = useState(ONE_DAY);
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
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      initData();
    } else {
      setConfirmModal(false);
      setEndTimeVisible(false);
      setStartTimeVisible(false);
      setEndTime();
      setStartTime();
      setEndDateVisible(false);
      setStartDateVisible(false);
      setEndDate();
      setStartDate();
      setTimes([]);
      setPickerType(null);
      setPickerDay(null);
      setDatePickerVisibility(false);
      setApplyForAllDays(false);
      setHolidayType(ONE_DAY);
      setHolidayDays([]);
    }
  }, [isFocused]);

  const initData = async () => {
    contextValue?.setLoader(true);
    const daysz = DAYS;
    try {
      const userId = await decryptService("userId");
      const params = { provider_id: userId };
      const res = await getHolidayData(params);
      const res2 = await getWeeklyHolidayData(params);
      const currentDay = new Date().getDay();
      const removedData = daysz.slice(currentDay - 1);
      let newDates = [...removedData, ...daysz.slice(0, currentDay - 1)];
      const newSetDates = [];
      newDates = newDates.map((it) => {
        return {
          label: it.key,
          start: "",
          end: "",
          selected: false,
          value: it.value,
        };
      });
      if (
        res?.status === 200 &&
        res?.data?.data?.end_date &&
        res?.data?.data?.end_time &&
        res?.data?.data?.start_date &&
        res?.data?.data?.start_time
      ) {
        setEndDate(res?.data?.data?.end_date);
        setStartDate(res?.data?.data?.start_date);
        setEndTime(res?.data?.data?.end_time);
        setStartTime(res?.data?.data?.start_time);
      }
      if (res2?.status === 200 && validArray(res2?.data?.data?.weeklyholiday)) {
        for (
          let index = 0;
          index < res2?.data?.data?.weeklyholiday.length;
          index++
        ) {
          const element = res2?.data?.data?.weeklyholiday[index];
          const foundIndex = newDates.findIndex(
            (it) =>
              it?.value?.toLowerCase() === element?.day_of_week?.toLowerCase()
          );
          newDates[foundIndex] = {
            ...newDates[foundIndex],
            start: moment(element?.start_time, "HH:mm").format("hh:mm A"),
            end: moment(element?.end_time, "HH:mm").format("hh:mm A"),
            selected: true,
          };
          newSetDates.push({
            ...newDates[foundIndex],
            start: moment(element?.start_time, "HH:mm").format("hh:mm A"),
            end: moment(element?.end_time, "HH:mm").format("hh:mm A"),
            selected: true,
          });
        }
      }
      setTimes(newDates);
      setHolidayDays(newSetDates);
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
    const formattedTime = moment(date).format("hh:mm A");
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
    const formattedDate = moment(date).format("hh:mm A");
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
    const formattedDate = moment(date).format("hh:mm A");
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
    const selected = [...holidayDays];
    const selectedDay = times?.findIndex((it) => it.label === day.label);
    const shiftValue = applyForAllDays ? WHOLE_DAY : EMPTY_DAY;
    temp[selectedDay] = {
      ...day,
      selected: !day?.selected,
      ...(!day?.selected ? shiftValue : {}),
    };
    const selectedLongDay = selected?.findIndex((it) => it.label === day.label);
    if (temp[selectedDay].selected) {
      selected.push(temp[selectedDay]);
    } else {
      selected.splice(selectedLongDay, 1);
    }
    setTimes(temp);
    setHolidayDays(selected);
  };

  const handleToggleAllDay = (value) => {
    contextValue?.setLoader(true);
    setApplyForAllDays(value);
    const temp = [];
    for (let index = 0; index < holidayDays.length; index++) {
      const element = holidayDays[index];
      element.start = "10:00 AM";
      element.end = "07:00 PM";
      temp.push(element);
    }
    setHolidayDays(temp);
    contextValue?.setLoader(false);
  };

  const validateLongHoliday = (userId) => {
    if (startDate && endDate && startTime && endTime) {
      const longHolidayParams = {
        provider_id: userId,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        isfullday: applyForAllDays ? 1 : 0,
        notes: "Scheduled maintenance",
      };
      return longHolidayParams;
    }
    return false;
  };

  const validateWeeklyHoliday = (userId) => {
    if (validArray(holidayDays)) {
      const weeklyHolidayData = [];
      for (let index = 0; index < holidayDays?.length; index++) {
        const element = holidayDays[index];
        if (element?.value && element?.start && element?.end) {
          const op = {
            day_of_week: element?.value,
            start_time: moment(element?.start, "hh:mm A").format("HH:mm"),
            end_time: moment(element?.end, "hh:mm A").format("HH:mm"),
            is_available: false,
          };
          weeklyHolidayData.push(op);
        } else {
          return false;
        }
      }
      const weeklyHolidayParams = {
        provider_id: userId,
        note: "Holiday schedule for provider",
        weeklyholiday: weeklyHolidayData,
      };
      return weeklyHolidayParams;
    }
    return false;
  };

  const onSubmit = async () => {
    try {
      const promises = [];
      contextValue?.setLoader(true);
      const userId = await decryptService("userId");
      const promise1 = validateLongHoliday(userId);
      const promise2 = validateWeeklyHoliday(userId);
      if (!promise1 && !promise2) {
        throw new Error(Strings.holidayError);
      }
      if (promise1) {
        promises.push(setHolidayData(promise1));
      }
      if (promise2) {
        promises.push(setWeeklyHolidayData(promise2));
      }
      const output = await Promise.allSettled(promises);
      output.forEach((element) => {
        if (element.status === "fulfilled") {
          showToast("success", element?.value?.data?.data || "Success");
        } else if (element.status === "rejected") {
          throw new Error(element?.reason?.message);
        }
      });
      contextValue?.setLoader(false);
      setConfirmModal(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message || "Something went wrong");
      setConfirmModal(false);
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
                mode={holidayType === ONE_DAY}
                title={"One Day"}
                onPress={() => setHolidayType(ONE_DAY)}
              />
              <SingleSelectCheckBox
                mode={holidayType === WEEKLY}
                title={"Every Week"}
                onPress={() => setHolidayType(WEEKLY)}
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
              <Pressable
                style={styles.rowSameDay}
                onPress={() => {
                  handleToggleAllDay(!applyForAllDays);
                }}
              >
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
                    label={Strings.selectDate2}
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
                  marginBottom: moderateScale(70),
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
                    label={Strings.selectDate2}
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
            </View>
          </ScrollView>
        </View>
        {holidayDays?.length > 0 ||
        (startDate && startTime && endDate && endTime) ? (
          <View
            style={[styles.submitButton, { width: width - moderateScale(20) }]}
          >
            <Button
              title={Strings.submit}
              onPress={() => {
                setConfirmModal(true);
              }}
            />
          </View>
        ) : null}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          display="spinner" 
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
          display="spinner" 
          onConfirm={handleStartTime}
          onCancel={hideStartTime}
        />
        <DateTimePickerModal
          isVisible={endTimeVisible}
          mode="time"
          display="spinner" 
          onConfirm={handleEndTime}
          onCancel={hideEndTime}
        />
        <Dialog
          flag={confirmModal}
          title={Strings.cancelAppointmentsTitle}
          description={Strings.cancelAppointmentsDescription}
          rightButtonText="Cancel"
          rightButtonPressed={onSubmit}
          onClose={() => {
            setConfirmModal(false);
          }}
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
    alignSelf: "center",
    marginBottom: moderateScale(10),
    position: "absolute",
    bottom: 0,
  },
  startDateInput: {
    flex: 1,
    fontSize: THEMES.fonts.font12,
    // marginStart: moderateScale(16),
    // marginEnd: moderateScale(8),
  },
});

export default MarkHoliday;
