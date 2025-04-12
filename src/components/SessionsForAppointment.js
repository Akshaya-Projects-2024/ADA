import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { moderateScale, ms } from "react-native-size-matters";
import Strings from "../constants/strings";
import { SESSION_TYPE } from "../pages/Services/selectAppointment";
import InputField from "./InputField";
import moment from "moment";
import { showToast, validArray } from "../utils/utils";
import { THEMES } from "../assets/theme/themes";
import SwitchOn from "../assets/svg/switchOn.svg";
import SwitchOff from "../assets/svg/switchSession.svg";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { contextValue } from "./Loader";
import { decryptService } from "../utils/storageFunc";
import { getProviderSlots } from "../redux-store/actions/auth";
import Button from "./Button";
import TimeSlotUI from "./sessionSlot";

const SessionsForAppointment = ({
  selectedProviderId,
  handleSubmit,
  buttonTitle = "Confirm",
  isrequestedbyProvider = false,
}) => {
  const [sessionSelection, setSessionSelection] = useState(
    SESSION_TYPE.oneTime
  );
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState({});
  const [slotsforSession, setSlotsforSession] = useState({});

  const handleDatePress = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };
  const memorizedSlots = useMemo(() => {
    if (selectedDate) {
      const slots = timeSlots[selectedDate.format("YYYY-MM-DD")];
      const morningSlots = [];
      const afternoonSlots = [];
      const eveningSlots = [];
      const isToday = selectedDate.isSame(moment(), "day");
      const currentHour = isToday ? parseInt(moment().format("HH")) : -1;
      for (let index = 0; index < slots?.length; index++) {
        const element = slots[index];
        const startArray = element?.start_time?.split(":");
        if (validArray(startArray)) {
          const start = parseInt(startArray[0]);
          if (isToday && start <= currentHour) {
            element.isslotpast = true;
          }
          if (start >= 0 && start < 12) {
            morningSlots.push(element);
          }
          if (start >= 12 && start < 17) {
            afternoonSlots.push(element);
          }
          if (start >= 17) {
            eveningSlots.push(element);
          }
        }
      }
      return {
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
      };
    }
    return {
      morning: [],
      afternoon: [],
      evening: [],
    };
  }, [selectedDate, timeSlots]);

  useEffect(() => {
    getDates();
  }, [getDates, sessionSelection]);

  useEffect(() => {
    getSessionData();
  }, [startDate, endDate, getSessionData]);

  const getDates = useCallback(async () => {
    if (sessionSelection === SESSION_TYPE.oneTime) {
      const start = moment();
      const end = moment(start).add(14, "days");
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate();
      setEndDate();
    }
  }, [sessionSelection]);

  const handleButtonPressed = () => {
    handleSubmit(
      selectedDate,
      startDate,
      endDate,
      selectedSlot,
      sessionSelection
    );
  };

  const getSessionData = useCallback(async () => {
    if (startDate && endDate) {
      try {
        contextValue?.setLoader(true);
        const userId = await decryptService("userId");
        const params = {
          userid: userId,
          providerid: selectedProviderId,
          startdate: moment(startDate)?.format("YYYY-MM-DD"),
          enddate: moment(endDate)?.format("YYYY-MM-DD"),
        };
        const res = await getProviderSlots(params);
        if (res?.status === 200) {
          const data = res?.data?.data;
          if (sessionSelection === SESSION_TYPE.recursive) {
            setSlotsforSession(data);
            setWeekDates([]);
            setTimeSlots({});
            setSelectedSlot(null);
          } else {
            const datesData = Object.keys(data);
            if (validArray(datesData)) {
              const weeksData = [];
              for (let index = 0; index < datesData.length; index++) {
                const element = datesData[index];
                weeksData.push(moment(element));
              }
              setWeekDates(weeksData);
            }
            setTimeSlots(data);
          }
        }
        contextValue?.setLoader(false);
      } catch (error) {
        contextValue?.setLoader(false);
        showToast("error", error?.message);
      }
    } else {
      setWeekDates([]);
      setTimeSlots({});
      setSlotsforSession({});
      setSelectedSlot(null);
    }
  }, [endDate, selectedProviderId, startDate]);

  const selectTimeSlot = (time) => {
    if (time.isavailable) {
      setSelectedSlot(time);
    }
  };

  const handleSwitch = () => {
    setStartDate();
    setEndDate();
    setSelectedDate(null);
    setSelectedSlot(null);
    setTimeSlots();
    setWeekDates();
    setSessionSelection((prevData) => {
      return prevData === SESSION_TYPE.oneTime
        ? SESSION_TYPE.recursive
        : SESSION_TYPE.oneTime;
    });
  };

  const handleStartDateConfirm = (date) => {
    setEndDate();
    setStartDate(date);
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const hideStartDatePicker = () => {
    setStartDateVisible(false);
  };

  const hideEndDatePicker = () => {
    setEndDateVisible(false);
  };

  const minmaxDate = useMemo(() => {
    return {
      minimumDate: startDate
        ? moment(startDate).add(1, "days").toDate()
        : new Date(),
      maximumDate: startDate
        ? moment(startDate).add(1, "month").toDate()
        : new Date(),
    };
  }, [startDate]);

  return (
    <View style={[styles.flex]}>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={handleSwitch}
          style={[
            styles.switchStyle,
            isrequestedbyProvider && { marginHorizontal: 0 },
          ]}
        >
          <Text
            style={[
              styles.headerTextV2,
              { opacity: sessionSelection === SESSION_TYPE.oneTime ? 1 : 0.16 },
              isrequestedbyProvider && { marginHorizontal: 0 },
            ]}
          >
            {Strings.oneSession}
          </Text>
          {sessionSelection === SESSION_TYPE.oneTime ? (
            <SwitchOn />
          ) : (
            <SwitchOff />
          )}
          <Text
            style={[
              styles.headerTextV2,
              { opacity: sessionSelection !== SESSION_TYPE.oneTime ? 1 : 0.2 },
            ]}
          >
            {Strings.dailySession}
          </Text>
        </Pressable>
        {sessionSelection === SESSION_TYPE.recursive ? (
          <>
            <View style={styles.pickerContainer}>
              <Pressable
                style={styles.flex}
                onPress={() => {
                  setStartDateVisible(true);
                }}
              >
                <InputField
                  label={Strings.startDate}
                  placeholderText={"--"}
                  value={
                    startDate ? moment(startDate)?.format("YYYY-MM-DD") : null
                  }
                  type="small"
                  inputStyle={
                    isrequestedbyProvider
                      ? { marginRight: ms(10) }
                      : styles.startDateInput
                  }
                  editable={false}
                />
              </Pressable>
              <Pressable
                style={styles.flex}
                onPress={() => {
                  setEndDateVisible(true);
                }}
              >
                <InputField
                  label={Strings.endDate}
                  placeholderText={"--"}
                  value={endDate ? moment(endDate)?.format("YYYY-MM-DD") : null}
                  type="small"
                  inputStyle={
                    isrequestedbyProvider
                      ? { marginLeft: ms(10) }
                      : styles.endDateInput
                  }
                  editable={false}
                />
              </Pressable>
            </View>
            {Boolean(Object.keys(slotsforSession)?.length) && (
              <TimeSlotUI
                data={slotsforSession}
                setSelectedSlot={setSelectedSlot}
                selectedSlot={selectedSlot}
                isrequestedbyProvider={isrequestedbyProvider}
              />
            )}
          </>
        ) : (
          <>
            {validArray(weekDates) ? (
              <View
                style={{
                  marginHorizontal: isrequestedbyProvider
                    ? 0
                    : moderateScale(14),
                  paddingTop: moderateScale(20),
                }}
              >
                <Text
                  style={[
                    styles.headerText,
                    isrequestedbyProvider && { marginHorizontal: 0 },
                  ]}
                >
                  Date
                </Text>
                <ScrollView
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {weekDates.map((date, index) => {
                    const isToday = date.isSame(moment(), "day");
                    const isSelected = date.isSame(selectedDate, "day");
                    return (
                      <TouchableOpacity
                        onPress={() => handleDatePress(date)}
                        key={index}
                        style={[
                          styles.dateContainer,
                          isSelected ? styles.selectedDate : null, // Highlight selected date
                          isToday && !isSelected ? styles.activeDate : null, // Highlight current date if it's not selected
                          isrequestedbyProvider && {
                            marginHorizontal: 0,
                            marginRight: moderateScale(10),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSelected ? styles.selectedDayText : null, // Highlight selected day text
                            isToday && !isSelected
                              ? styles.activeDayText
                              : null, // Highlight today's text
                          ]}
                        >
                          {date.format("ddd")}
                        </Text>
                        <Text
                          style={[
                            styles.dateText,
                            isSelected ? styles.selectedDateText : null, // Highlight selected date text
                            isToday && !isSelected
                              ? styles.activeDateText
                              : null, // Highlight today's text
                          ]}
                        >
                          {date.format("D")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
            <>
              {validArray(memorizedSlots?.morning) ? (
                <View
                  style={[
                    {
                      paddingTop: moderateScale(20),
                      paddingHorizontal: moderateScale(16),
                    },
                    isrequestedbyProvider && { paddingHorizontal: 0 },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font14,
                        paddingBottom: moderateScale(5),
                        paddingHorizontal: moderateScale(5),
                      },
                      isrequestedbyProvider && { paddingHorizontal: 0 },
                    ]}
                  >
                    Morning
                  </Text>
                  <View style={styles.timeSlotRow}>
                    {memorizedSlots?.morning?.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlot,
                          !slot?.isavailable && styles.disabledSlot,
                          slot?.isbooked && styles.bookedSlot,
                          slot?.isslotpast && styles.pastSlot,
                          selectedSlot?.start_time === slot?.start_time &&
                            !slot?.isbooked &&
                            !slot?.isslotpast &&
                            styles.selectedSlotStyle,
                          isrequestedbyProvider && { marginHorizontal: 0 },
                        ]}
                        onPress={() => selectTimeSlot(slot)}
                        disabled={slot?.isbooked || slot?.isslotpast} // Disable if the slot is marked as disabled
                      >
                        <Text
                          style={StyleSheet.flatten([
                            slot?.isbooked ? styles.disabledText : {},
                            styles.startTimeText,
                            {
                              color:
                                selectedSlot?.start_time === slot?.start_time
                                  ? "#fff"
                                  : slot?.isavailable || slot?.isbooked
                                  ? "#000"
                                  : "#fff",
                            },
                          ])}
                        >
                          {slot?.start_time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}

              {validArray(memorizedSlots?.afternoon) ? (
                <View
                  style={[
                    {
                      paddingTop: moderateScale(20),
                      paddingHorizontal: moderateScale(16),
                    },
                    isrequestedbyProvider && { paddingHorizontal: 0 },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font14,
                        paddingBottom: moderateScale(5),
                        paddingHorizontal: moderateScale(5),
                      },
                      isrequestedbyProvider && { paddingHorizontal: 0 },
                    ]}
                  >
                    Afternoon
                  </Text>

                  <View style={styles.timeSlotRow}>
                    {memorizedSlots?.afternoon?.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlot,
                          !slot?.isavailable && styles.disabledSlot,
                          slot?.isbooked && styles.bookedSlot,
                          slot?.isslotpast && styles.pastSlot,
                          selectedSlot?.start_time === slot?.start_time &&
                            !slot?.isbooked &&
                            !slot?.isslotpast &&
                            styles.selectedSlotStyle,
                          isrequestedbyProvider && {
                            marginHorizontal: 0,
                            marginRight: moderateScale(10),
                          },
                        ]}
                        onPress={() => selectTimeSlot(slot)}
                        disabled={slot?.isbooked || slot?.isslotpast} // Disable if the slot is marked as disabled
                      >
                        <Text
                          style={StyleSheet.flatten([
                            slot?.isbooked ? styles.disabledText : {},
                            styles.startTimeText,
                            {
                              color:
                                selectedSlot?.start_time === slot?.start_time
                                  ? "#fff"
                                  : slot?.isavailable || slot?.isbooked
                                  ? "#000"
                                  : "#fff",
                            },
                          ])}
                        >
                          {slot?.start_time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
              {validArray(memorizedSlots?.evening) ? (
                <View
                  style={[
                    {
                      paddingTop: moderateScale(20),
                      paddingHorizontal: moderateScale(16),
                    },
                    isrequestedbyProvider && { paddingHorizontal: 0 },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.semiBold,
                        fontSize: THEMES.fonts.font14,
                        paddingBottom: moderateScale(5),
                        paddingHorizontal: moderateScale(5),
                      },
                      isrequestedbyProvider && { paddingHorizontal: 0 },
                    ]}
                  >
                    Evening
                  </Text>
                  <View style={styles.timeSlotRow}>
                    {memorizedSlots.evening.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlot,
                          !slot?.isavailable && styles.disabledSlot,
                          slot?.isbooked && styles.bookedSlot,
                          slot?.isslotpast && styles.pastSlot,
                          selectedSlot?.start_time === slot?.start_time &&
                            !slot?.isbooked &&
                            !slot?.isslotpast &&
                            styles.selectedSlotStyle,
                          isrequestedbyProvider && {
                            marginHorizontal: 0,
                            marginRight: moderateScale(10),
                          },
                        ]}
                        onPress={() => selectTimeSlot(slot)}
                        disabled={slot?.isbooked || slot?.isslotpast} // Disable if the slot is marked as disabled
                      >
                        <Text
                          style={StyleSheet.flatten([
                            slot?.isbooked ? styles.disabledText : {},
                            styles.startTimeText,
                            {
                              color:
                                selectedSlot?.start_time === slot?.start_time
                                  ? "#fff"
                                  : slot?.isavailable || slot?.isbooked
                                  ? "#000"
                                  : "#fff",
                            },
                          ])}
                        >
                          {slot?.start_time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          </>
        )}
      </ScrollView>
      <DateTimePickerModal
        isVisible={startDateVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
        minimumDate={new Date()}
        date={startDate ? new Date(startDate) : new Date()}
      />
      <DateTimePickerModal
        isVisible={endDateVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
        minimumDate={minmaxDate?.minimumDate}
        date={endDate ? new Date(endDate) : new Date()}
        maximumDate={minmaxDate?.maximumDate}
      />
      <View
        style={[
          styles.button,
          isrequestedbyProvider && { marginHorizontal: 0 },
        ]}
      >
        <Button title={buttonTitle} onPress={handleButtonPressed} />
      </View>
    </View>
  );
};

export default SessionsForAppointment;

const styles = StyleSheet.create({
  switchStyle: {
    marginHorizontal: moderateScale(14),
    paddingTop: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  startTimeText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
  },
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  flex: {
    flex: 1,
  },
  categoryText: {
    color: "#707070",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font13,
  },
  selectedText: {
    color: "#fff",
    fontFamily: THEMES.fontFamily.medium,
    fontSize: THEMES.fonts.font13,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#797979",
    borderEndStartRadius: 0,
    margin: 4,
  },
  selectedButton: {
    backgroundColor: THEMES.colors.cyan, // Change to the selected color
    borderColor: "transparent",
  },
  headerText: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    marginBottom: 10,
    marginHorizontal: moderateScale(6),
    color: THEMES.colors.black,
  },
  headerTextV2: {
    fontSize: THEMES.fonts.font14,
    fontFamily: THEMES.fontFamily.semiBold,
    marginHorizontal: moderateScale(6),
    color: THEMES.colors.black,
  },
  scrollContainer: {
    flexDirection: "row",
  },
  dateContainer: {
    width: 53, // Adjust the width of each date container
    height: 53,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#CFD3D4",
    borderWidth: 1,
  },
  activeDate: {
    backgroundColor: THEMES.colors.orange, // Active background color for current day
  },
  dayText: {
    fontSize: THEMES.fonts.font12,
    color: "#000",
    fontFamily: THEMES.fontFamily.regular,
  },
  dateText: {
    fontSize: THEMES.fonts.font12,
    color: "#000",
    fontFamily: THEMES.fontFamily.medium,
  },
  activeDayText: {
    color: "#fff", // Active day text color
  },
  activeDateText: {
    color: "#fff", // Active date text color
  },
  timeSlotRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures time slots wrap to the next line
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#ffffff",
    borderColor: "#CFD3D4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    margin: 5,
  },
  selectedSlotStyle: {
    backgroundColor: THEMES.colors.cyan,
  },
  disabledSlot: {
    backgroundColor: "#AAAAAA", // Gray background for disabled slots
    borderColor: "#AAAAAA",
  },
  bookedSlot: {
    backgroundColor: THEMES.colors.bookedSlot,
    borderColor: THEMES.colors.outrageousOrange,
  },
  pastSlot: {
    backgroundColor: THEMES.colors.lightGrey,
    borderColor: THEMES.colors.lightGrey,
    opacity: 0.2,
  },
  selectedDate: {
    backgroundColor: THEMES.colors.cyan, // Highlight for selected date
  },
  selectedDateText: {
    color: "#fff", // Selected date text color
  },
  selectedDayText: {
    color: "#fff", // Selected day text color
  },
  sessionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEMES.colors.bgColor,
    padding: 10,
    borderRadius: 20,
    paddingTop: moderateScale(15),
  },
  selectedRadioText: {
    color: "#000", // Darker color for selected text
    fontWeight: "bold",
  },
  pickerContainer: { flexDirection: "row", marginTop: moderateScale(16) },
  startDateInput: {
    flex: 1,
    marginStart: moderateScale(16),
    marginEnd: moderateScale(8),
  },
  endDateInput: {
    flex: 1,
    marginEnd: moderateScale(16),
    marginStart: moderateScale(8),
  },
  loadingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingBox: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderRadius: 10,
    backgroundColor: THEMES.colors.cyan,
    borderWidth: 1,
  },
  button: {
    marginHorizontal: moderateScale(20),
    bottom: 0,
    paddingTop: moderateScale(30),
    marginBottom: moderateScale(20),
  },
});
