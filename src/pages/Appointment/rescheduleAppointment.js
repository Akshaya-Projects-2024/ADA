import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Calendars from "../../assets/svg/calendar.svg";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import {
  getProviderSlots,
  rescheduleAppointment,
} from "../../redux-store/actions/auth";
import { showToast, validArray } from "../../utils/utils";
import { contextValue } from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import { decryptService } from "../../utils/storageFunc";
import { useSelector } from "react-redux";

const RescheduleAppointment = ({ navigation, route }) => {
  const selectedItem = route?.params?.selectedItem;
  const [isAM, setIsAM] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateVisible, setDateVisibility] = useState(false);
  const [time, setTime] = useState();
  const [date, selectedDate] = useState();
  const [reason, setReason] = useState("");
  const profile = useSelector((state) => state?.commonReducer);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState({});

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (pickedTime) => {
    const formattedTime = moment(pickedTime).format("HH:mm");
    const formattedPeriod = moment(pickedTime).format("A");
    setTime(formattedTime);
    if (formattedPeriod == "PM") {
      setIsAM(false);
    } else {
      setIsAM(true);
    }
    hideDatePicker();
  };

  const hideDatePickerCancel = () => {
    setDateVisibility(false);
  };

  const handleDateConfirm = (pickedDate) => {
    const formattedDate = moment(pickedDate).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    setTime("");
    hideDatePickerCancel();
  };

  const memorizedSlots = useMemo(() => {
    if (date) {
      const slots =
        timeSlots?.[moment(date, "DD/MM/YYYY")?.format("YYYY-MM-DD")];
      const morningSlots = [];
      const afternoonSlots = [];
      const eveningSlots = [];
      const isToday = moment(date, "DD/MM/YYYY").isSame(moment(), "day");
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
  }, [timeSlots, date]);

  const getSessionData = async () => {
    const selectedProviderId = profile?.logindetails?.userid;
    try {
      contextValue?.setLoader(true);
      const userId = await decryptService("userId");
      const params = {
        userid: userId,
        providerid: selectedProviderId,
        startdate: moment(date, "DD/MM/YYYY")?.format("YYYY-MM-DD"),
        enddate: moment(date, "DD/MM/YYYY")?.format("YYYY-MM-DD"),
      };

      const res = await getProviderSlots(params);

      if (res?.status == 200) {
        const data = res?.data?.data;
        setTimeSlots(data);
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  useEffect(() => {
    date && getSessionData();
  }, [date]);

  const onSubmit = async () => {
    try {
      contextValue?.setLoader(true);
      if (!date) {
        throw new Error("Please select valid date");
      } else if (!selectedSlot?.start_time) {
        throw new Error("Please provide valid time");
      } else if (!reason) {
        throw new Error("Please provide valid reason");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
          appointment_date: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"),
          start_time: selectedSlot?.start_time,
          end_time: selectedSlot?.end_time,
          status: "rescheduled",
          notes: reason,
          requestedby: "provider",
          modifiedName: selectedItem?.providername,
        };
        const res = await rescheduleAppointment(params);
        if (res?.status === 200) {
          showToast("success", res?.data?.data);
          navigation.goBack();
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
    }
  };

  const selectTimeSlot = (time) => {
    if (time.isavailable) {
      setSelectedSlot(time);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header
          title={Strings.rescheduleAppointment}
          showBack
          bgColor="transparent"
          fontColor={THEMES.colors.black}
        />
        <View style={styles.mainContent}>
          <View style={styles.rowContent}>
            <Text style={styles.selectDateText}>{Strings.selectDate}</Text>
            <View>
              <View style={styles.flexRow}>
                <View
                  style={[
                    styles.dateContainer,
                    {
                      paddingHorizontal: date
                        ? moderateScale(15)
                        : moderateScale(10),
                    },
                  ]}
                >
                  {date ? (
                    <Text style={styles.dateValue}>{date}</Text>
                  ) : (
                    <Text style={styles.datePlaceholderText}>
                      {Strings.ddMMYYYY}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setDateVisibility(true)}
                  style={styles.calendarIcon}
                >
                  <Calendars />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <View style={{ paddingTop: moderateScale(45) }}>
            <View style={styles.selectTimeRow}>
              <Text style={styles.selectTimeText}>{Strings.selectTime}</Text>
              <View>
                <View style={styles.rowStyle}>
                  <TouchableOpacity
                    disabled={!date ? true : false}
                    onPress={() => setDatePickerVisibility(true)}
                    style={[
                      styles.timeContainer,
                      {
                        paddingHorizontal: time
                          ? moderateScale(15)
                          : moderateScale(10),
                      },
                    ]}
                  >
                    {time ? (
                      <Text style={styles.timeValueText}>{time}</Text>
                    ) : (
                      <Text style={styles.hourMinPlaceHolder}>
                        {Strings.hhmm}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <View style={styles.btncontainer}>
                    <TouchableOpacity
                      disabled={time ? true : false}
                      style={[styles.button, isAM && styles.activeButton]}
                      onPress={() => setIsAM(true)}
                    >
                      <Text style={[styles.text, isAM && styles.activeText]}>
                        {Strings.am}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={time ? true : false}
                      style={[styles.button, !isAM && styles.activeButton]}
                      onPress={() => setIsAM(false)}
                    >
                      <Text style={[styles.text, !isAM && styles.activeText]}>
                        {Strings.pm}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View> */}
          <>
            {validArray(memorizedSlots?.morning) ? (
              <View
                style={{
                  paddingTop: moderateScale(20),
                }}
              >
                <Text
                  style={{
                    color: THEMES.colors.black,
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font14,
                    paddingBottom: moderateScale(5),
                  }}
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
                style={{
                  paddingTop: moderateScale(20),
                }}
              >
                <Text
                  style={{
                    color: THEMES.colors.black,
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font14,
                    paddingBottom: moderateScale(5),
                  }}
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
                style={{
                  paddingTop: moderateScale(20),
                }}
              >
                <Text
                  style={{
                    color: THEMES.colors.black,
                    fontFamily: THEMES.fontFamily.semiBold,
                    fontSize: THEMES.fonts.font14,
                    paddingBottom: moderateScale(5),
                  }}
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
            {Boolean(date && !Object.keys(timeSlots)?.length) && (
              <View
                style={{ paddingTop: moderateScale(30), alignItems: "center" }}
              >
                <Text
                  style={{
                    color: THEMES.colors.red,
                    fontFamily: THEMES.fontFamily.regular,
                    fontSize: THEMES.fonts.font14,
                  }}
                >
                  No slots available for selected date
                </Text>
              </View>
            )}
          </>
          <View style={{ paddingTop: moderateScale(45) }}>
            <InputField
              label={""}
              placeholderText={Strings.writeAMessageForReschedule}
              multiline={true}
              value={reason}
              onChange={setReason}
            />
          </View>
        </View>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button
              title={Strings.sendRequest}
              onPress={onSubmit}
              disabled={Boolean(date && !Object.keys(timeSlots)?.length)}
            />
          </View>
        )}
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="time"
          display="spinner"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={time ? moment(time, "HH:mm").toDate() : new Date()}
        />

        <DateTimePicker
          isVisible={isDateVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePickerCancel}
          date={date ? moment(date, "DD/MM/YYYY").toDate() : new Date()}
          minimumDate={new Date()}
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
  btncontainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: THEMES.colors.lightSilver,
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: moderateScale(10),
    height: 40,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: THEMES.colors.persimmon,
    borderColor: THEMES.colors.persimmon,
  },
  text: {
    color: THEMES.colors.black,
    fontWeight: "bold",
    fontSize: THEMES.fonts.font12,
  },
  activeText: {
    color: THEMES.colors.white,
    fontSize: THEMES.fonts.font12,
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    marginBottom: moderateScale(20),
    paddingHorizontal: moderateScale(27),
  },
  mainContent: {
    paddingTop: moderateScale(20),
    paddingHorizontal: moderateScale(27),
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectDateText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center ",
    justifyContent: "center",
  },
  dateValue: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  datePlaceholderText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  calendarIcon: {
    borderWidth: 0.8,
    borderColor: THEMES.colors.darkGrey,
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    borderBottomLeftRadius: 0,
  },
  selectTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectTimeText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },
  hourMinPlaceHolder: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  timeValueText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center ",
    justifyContent: "center",
  },
  dateContainer: {
    borderWidth: 0.8,
    borderColor: THEMES.colors.darkGrey,
    borderRadius: 8,
    alignItems: "center ",
    justifyContent: "center",
    paddingVertical: moderateScale(10),
  },
  timeContainer: {
    borderRadius: 8,
    alignItems: "center ",
    justifyContent: "center",
    borderRadius: 8,
    height: 40,
    borderWidth: 0.8,
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
  startTimeText: {
    fontSize: THEMES.fonts.font12,
    fontFamily: THEMES.fontFamily.medium,
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
    marginVertical: 5,
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
  selectedDate: {
    backgroundColor: THEMES.colors.cyan, // Highlight for selected date
  },
  selectedDateText: {
    color: "#fff", // Selected date text color
  },
  selectedDayText: {
    color: "#fff", // Selected day text color
  },
});

export default RescheduleAppointment;
