import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import { moderateScale, s } from "react-native-size-matters";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Calendars from "../../assets/svg/calendar.svg";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

const RescheduleAppointment = () => {
  const [isAM, setIsAM] = useState(true);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateVisible, setDateVisibility] = useState(false);
  const [time, setTime] = useState();
  const [date, selectedDate] = useState();

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

  const handleConfirm = (date) => {
    const formattedTime = moment(date).format("HH:mm");
    const formattedPeriod = moment(date).format("A");

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

  const handleDateConfirm = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    selectedDate(formattedDate);
    hideDatePickerCancel();
  };

  return (
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
            <Text style={styles.selectTimeText}>{Strings.selectTime}</Text>
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
          <InputField
            label={""}
            placeholderText={Strings.writeAMessageForReschedule}
            multiline={true}
          />
        </View>
      </View>
      {!isKeyboardVisible && (
        <View style={styles.submitButton}>
          <Button title={Strings.sendRequest} />
        </View>
      )}
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePicker
        isVisible={isDateVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePickerCancel}
      />
    </View>
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
    borderRadius: 8,
    height: 40,
    borderWidth: 0.8,
  },
});

export default RescheduleAppointment;
