import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
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
import { rescheduleAppointment } from "../../redux-store/actions/auth";
import { showToast, validArray, validObject } from "../../utils/utils";
import { contextValue } from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";

const AppointmentSlotItem = ({ slot, index }) => {
  return (
    <View
      key={`${slot?.start_time}_${index}`}
      style={[
        styles.timeSlot,
        !slot?.isavailable && styles.disabledSlot,
        slot?.isbooked && styles.bookedSlot,
      ]}
    >
      <Text
        style={StyleSheet.flatten([
          slot?.isbooked ? styles.disabledText : {},
          styles.startTimeText,
          {
            color: slot?.isavailable || slot?.isbooked ? "#000" : "#fff",
          },
        ])}
      >
        {slot?.start_time}
      </Text>
    </View>
  );
};

const RescheduleAppointment = ({ navigation, route }) => {
  const selectedItem = route?.params?.selectedItem;
  const [isAM, setIsAM] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isDateVisible, setDateVisibility] = useState(false);
  const [time, setTime] = useState();
  const [isEndAM, setEndIsAM] = useState(true);
  const [endTime, setEndTime] = useState();
  const [date, selectedDate] = useState();
  const [reason, setReason] = useState("");
  const [appointments, setAppointments] = useState({ label: "", data: [] });

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

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
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

  const handleEndTimeConfirm = (pickedTime) => {
    const formattedTime = moment(pickedTime).format("HH:mm");
    const formattedPeriod = moment(pickedTime).format("A");
    setEndTime(formattedTime);
    if (formattedPeriod == "PM") {
      setEndIsAM(false);
    } else {
      setEndIsAM(true);
    }
    hideEndDatePicker();
  };

  const hideDatePickerCancel = () => {
    setDateVisibility(false);
  };

  const handleDateConfirm = (pickedDate) => {
    const formattedDate = moment(pickedDate).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    hideDatePickerCancel();
  };

  const onSubmit = async () => {
    try {
      contextValue?.setLoader(true);
      if (!date) {
        throw new Error("Please select valid date");
      } else if (!time) {
        throw new Error("Please provide valid time");
      } else if (!endTime) {
        throw new Error("Please provide valid end time");
      } else if (!reason) {
        throw new Error("Please provide valid reason");
      } else {
        const params = {
          appointment_id: selectedItem?.appointment_id,
          parent_id: selectedItem?.parentdetails?.userid,
          provider_id: selectedItem?.provider_id,
          appointment_date: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"),
          start_time: time,
          end_time: endTime,
          status: "rescheduled",
          notes: reason,
          requestedby: "provider",
        };
        const res = await rescheduleAppointment(params);
        if (res?.status === 200) {
          navigation.goBack();
        } else if (validObject(res?.data)) {
          showToast("error", res?.message);
          const entries = Object.entries(res?.data);
          if (validArray(entries)) {
            const firstEntry = entries?.[0];
            if (validArray(firstEntry)) {
              setAppointments({
                label: moment(firstEntry[0], "YYYY-MM-DD").format("DD/MM/YYYY"),
                data: firstEntry[1],
              });
            }
          }
        }
      }
      contextValue?.setLoader(false);
    } catch (error) {
      contextValue?.setLoader(false);
      showToast("error", error?.message);
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
          <View style={{ paddingTop: moderateScale(45) }}>
            <View style={styles.selectTimeRow}>
              <Text style={styles.selectTimeText}>
                {Strings.selectStartTime}
              </Text>
              <View>
                <View style={styles.rowStyle}>
                  <TouchableOpacity
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
          </View>
          <View style={{ paddingTop: moderateScale(45) }}>
            <View style={styles.selectTimeRow}>
              <Text style={styles.selectTimeText}>{Strings.selectEndTime}</Text>
              <View>
                <View style={styles.rowStyle}>
                  <TouchableOpacity
                    onPress={() => setEndDatePickerVisibility(true)}
                    style={[
                      styles.timeContainer,
                      {
                        paddingHorizontal: endTime
                          ? moderateScale(15)
                          : moderateScale(10),
                      },
                    ]}
                  >
                    {endTime ? (
                      <Text style={styles.timeValueText}>{endTime}</Text>
                    ) : (
                      <Text style={styles.hourMinPlaceHolder}>
                        {Strings.hhmm}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <View style={styles.btncontainer}>
                    <TouchableOpacity
                      disabled={endTime ? true : false}
                      style={[styles.button, isEndAM && styles.activeButton]}
                      onPress={() => setEndIsAM(true)}
                    >
                      <Text style={[styles.text, isEndAM && styles.activeText]}>
                        {Strings.am}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={endTime ? true : false}
                      style={[styles.button, !isEndAM && styles.activeButton]}
                      onPress={() => setEndIsAM(false)}
                    >
                      <Text
                        style={[styles.text, !isEndAM && styles.activeText]}
                      >
                        {Strings.pm}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ paddingTop: moderateScale(45) }}>
            <InputField
              label={""}
              placeholderText={Strings.writeAMessageForReschedule}
              multiline={true}
              value={reason}
              onChange={setReason}
            />
          </View>
          {validArray(appointments?.data) ? (
            <View style={styles.slotsContainer}>
              <Text style={styles.selectTimeText}>
                {`${Strings.availableSlots}${appointments?.label}`}
              </Text>
              <View style={styles.timeSlotRow}>
                {appointments?.data?.map((it, indx) => {
                  return <AppointmentSlotItem index={indx} slot={it} />;
                })}
              </View>
            </View>
          ) : null}
        </View>
        {!isKeyboardVisible && (
          <View style={styles.submitButton}>
            <Button title={Strings.sendRequest} onPress={onSubmit} />
          </View>
        )}
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="time"
          display="spinner"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePicker
          isVisible={isEndDatePickerVisible}
          mode="time"
          display="spinner"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideDatePickerCancel}
        />
        <DateTimePicker
          isVisible={isDateVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePickerCancel}
          minimumDate={moment(
            selectedItem?.appointment_date,
            "YYYY-MM-DD"
          ).toDate()}
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
    paddingTop: moderateScale(50),
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
  timeSlot: {
    backgroundColor: "#ffffff",
    borderColor: "#CFD3D4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    margin: 5,
  },
  disabledSlot: {
    backgroundColor: "#AAAAAA", // Gray background for disabled slots
    borderColor: "#AAAAAA",
  },
  bookedSlot: {
    backgroundColor: THEMES.colors.bookedSlot,
    borderColor: THEMES.colors.outrageousOrange,
  },
  selectedSlotStyle: {
    backgroundColor: THEMES.colors.cyan,
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
  slotsContainer: { flexGrow: 1, marginTop: moderateScale(10) },
});

export default RescheduleAppointment;
