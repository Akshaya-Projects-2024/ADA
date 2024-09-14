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
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import { moderateScale } from "react-native-size-matters";
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
      <View
        style={{
          paddingTop: moderateScale(50),
          paddingHorizontal: moderateScale(27),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: THEMES.fontFamily.semiBold,
              fontSize: THEMES.fonts.font14,
              color: THEMES.colors.black,
            }}
          >
            Select Date
          </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center ",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  borderWidth: 0.8,
                  borderColor: THEMES.colors.darkGrey,
                  borderRadius: 8,
                  alignItems: "center ",
                  justifyContent: "center",
                  paddingHorizontal: date? moderateScale(15): moderateScale(10),
                  paddingVertical: moderateScale(10),
                }}
              >
                <Text
                  style={{
                    fontFamily: THEMES.fontFamily.medium,
                    fontSize: THEMES.fonts.font14,
                    color: THEMES.colors.black,
                  }}
                >
                  {date ? (
                    <Text
                      style={{
                        fontSize: THEMES.fonts.font14,
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.medium,
                      }}
                    >
                      {date}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: THEMES.fonts.font14,
                        color: THEMES.colors.darkGrey,
                        fontFamily: THEMES.fontFamily.medium,
                      }}
                    >
                      DD/MM/YYYY
                    </Text>
                  )}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDateVisibility(true)}
                style={{
                  borderWidth: 0.8,
                  borderColor: THEMES.colors.darkGrey,
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 8,
                  borderBottomLeftRadius: 0,
                }}
              >
                <Calendars />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ paddingTop: moderateScale(45) }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: THEMES.fontFamily.semiBold,
                fontSize: THEMES.fonts.font14,
                color: THEMES.colors.black,
              }}
            >
              Select Time
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center ",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setDatePickerVisibility(true)}
                  style={{
                    borderRadius: 8,
                    alignItems: "center ",
                    justifyContent: "center",
                    borderRadius: 8,
                    height: 40,
                    borderWidth: 0.8,
                    paddingHorizontal: time
                      ? moderateScale(15)
                      : moderateScale(10),
                  }}
                >
                  {time ? (
                    <Text
                      style={{
                        fontSize: THEMES.fonts.font14,
                        color: THEMES.colors.black,
                        fontFamily: THEMES.fontFamily.medium,
                      }}
                    >
                      {time}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: THEMES.fonts.font12,
                        color: THEMES.colors.darkGrey,
                        fontFamily: THEMES.fontFamily.medium,
                      }}
                    >
                      HH:MM
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
                      AM
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={time ? true : false}
                    style={[styles.button, !isAM && styles.activeButton]}
                    onPress={() => setIsAM(false)}
                  >
                    <Text style={[styles.text, !isAM && styles.activeText]}>
                      PM
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
    borderColor: "#ccc",
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
    backgroundColor: "#FF6F4D",
    borderColor: "#FF6F4D",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    fontSize: THEMES.fonts.font12,
  },
  activeText: {
    color: "#fff",
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
});

export default RescheduleAppointment;
