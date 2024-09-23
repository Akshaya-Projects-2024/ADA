import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Calendar from "../../assets/svg/calendar_event.svg";
import Time from "../../assets/svg/circle_event.svg";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../utils/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import ClipboardPaste from "../../assets/svg/clipboardPaste.svg";
import ArrowDown from "../../assets/svg/arrowDown.svg";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import CalendarScreen from "./calendarScreen";
import Button from "../../components/Button";
import BlackCross from "../../assets/svg/cross.svg";
import Modal from "react-native-modal";

const CreateEvent = () => {
  const [isStartTimeModalVisible, setStartTimeModalVisible] = useState(false);
  const [isEndTimeModalVisible, setEndTimeModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [sDate, setSDate] = useState();
  const [eDate, setEDate] = useState();

  const hideStartDatePicker = () => {
    setStartTimeModalVisible(false);
  };

  const handleStartConfirm = (date) => {
    const formattedTime = moment(date).format("HH:mm:A");
    setStartTime(formattedTime);
    hideStartDatePicker();
  };

  const hideEndDatePicker = () => {
    setEndTimeModalVisible(false);
  };

  const handleEndConfirm = (date) => {
    const formattedTime = moment(date).format("HH:mm:A");
    setEndTime(formattedTime);
    hideEndDatePicker();
  };

  const onSubmit = () => {};

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header
        title={"Create Event"}
        fontColor="#EC559C"
        showBack
        bgColor="transparent"
      />
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainView}>
          <InputField
            label={"Name of Event/ Offer*"}
            placeholderText={"Enter Name of Event/ Offer"}
          />
          <View style={styles.pt16}>
            <InputField
              label={"Description*"}
              placeholderText={"Enter the offer description"}
              multiline
            />
          </View>
          <View style={styles.pt16}>
            <InputField
              label={"Location"}
              placeholderText={"Enter location name"}
            />
          </View>
          <View style={styles.dateView}>
            <Text style={styles.startDate}>Start</Text>
            <TouchableOpacity
              style={styles.dates}
              onPress={() => setCalendarModal(true)}
            >
              <View style={{ paddingRight: moderateScale(9) }}>
                <Text style={styles.selectDateText}>Select Date</Text>
                <Text style={styles.dateText}>
                  {sDate ? sDate : "DD/MM/YYYY"}
                </Text>
              </View>
              <Calendar />
            </TouchableOpacity>

            <View style={styles.timeView}>
              <TouchableOpacity
                onPress={() => setStartTimeModalVisible(true)}
                style={{ paddingRight: moderateScale(9) }}
              >
                <Text style={styles.timeText}>Time</Text>
                {startTime ? (
                  <Text style={styles.timeValue}>{startTime}</Text>
                ) : (
                  <Text style={styles.timeValue}>{Strings.hhmm}</Text>
                )}
              </TouchableOpacity>
              <Time />
            </View>
          </View>

          <View style={styles.endContent}>
            <Text style={styles.endText}>End</Text>
            <TouchableOpacity  onPress={() => setCalendarModal(true)} style={styles.endValue}>
              <View style={{ paddingRight: moderateScale(9) }}>
                <Text style={styles.datePlaceholder}>Select Date</Text>
                <Text style={styles.value}>{eDate ? eDate : "DD/MM/YYYY"}</Text>
              </View>
              <Calendar />
            </TouchableOpacity>

            <View style={styles.endValue}>
              <TouchableOpacity
                onPress={() => setEndTimeModalVisible(true)}
                style={{
                  paddingRight: moderateScale(9),
                  backgroundColor: "#fff",
                }}
              >
                <Text style={styles.datePlaceholder}>Time</Text>
                {endTime ? (
                  <Text style={styles.timeValue}>{endTime}</Text>
                ) : (
                  <Text style={styles.timeValue}>{Strings.hhmm}</Text>
                )}
              </TouchableOpacity>
              <Time />
            </View>
          </View>

          <View style={styles.pt16}>
            <InputField
              label={"Contact Information*"}
              placeholderText={"Enter Location Name"}
            />
          </View>
          <View style={styles.pt16}>
            <InputField
              label={"Registration Link"}
              placeholderText={"Paste registration link"}
              rightIcon={<ClipboardPaste stroke={THEMES.colors.silver} />}
            />
          </View>
          <View style={styles.pt16}>
            <InputField
              label={"Select whom to send"}
              placeholderText={"Select"}
              rightIcon={<ArrowDown stroke={THEMES.colors.darkGrey} />}
            />
          </View>
        </View>
        <View
          style={{
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScale(10),
          }}
        >
          <Button title="Submit" onPress={() => setSuccess(true)}></Button>
          <Modal
            onBackdropPress={() => setSuccess(false)}
            isVisible={success}
            backdropOpacity={0.5}
            style={{
              margin: 0,
              borderRadius: 16,
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: THEMES.colors.bgColor,
                paddingVertical: moderateScale(24),
                paddingHorizontal: moderateScale(24),
                borderRadius: 16,
                marginHorizontal: moderateScale(29),
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    color: THEMES.colors.black,
                    fontFamily: THEMES.fontFamily.bold,
                    fontSize: THEMES.fonts.font20,
                    width: "70%",
                    lineHeight: moderateScale(24),
                  }}
                >
                  ✨ Event Created Successfully!✨
                </Text>
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                  onPress={() => setSuccess(false)}
                >
                  <BlackCross />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: THEMES.colors.black,
                  fontFamily: THEMES.fontFamily.regular,
                  fontSize: THEMES.fonts.font14,
                  paddingTop: moderateScale(16),
                  lineHeight: moderateScale(20),
                }}
              >
                Congratulations! Your event has been created. Get ready to meet
                some furry friends!
              </Text>
              <View
                style={{
                  alignItems: "center",

                  paddingTop: moderateScale(31),
                }}
              >
                <Button
                  title="Go back to Homescreen"
                  onPress={() => setSuccess(false)}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      <DateTimePicker
        isVisible={isStartTimeModalVisible}
        mode="time"
        onConfirm={handleStartConfirm}
        onCancel={hideStartDatePicker}
      />
      <DateTimePicker
        isVisible={isEndTimeModalVisible}
        mode="time"
        onConfirm={handleEndConfirm}
        onCancel={hideEndDatePicker}
      />
      {calendarModal && (
        <Modal
          isVisible={calendarModal}
          backdropOpacity={0.5}
          onBackdropPress={() => setCalendarModal(false)}
          style={{ margin: 0, flex: 1 }}
        >
          <CalendarScreen
            onBack={() => setCalendarModal(false)}
            setEDate={setEDate}
            sDate={sDate}
            eDate={eDate}
            setSDate={setSDate}
          />
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  mainView: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(30),
    marginBottom: moderateScale(20),
  },
  pt16: {
    paddingTop: moderateScale(16),
  },
  dateView: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  startDate: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    width: "15%",
  },
  dates: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    marginLeft: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectDateText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  dateText: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    paddingTop: moderateScale(5),
  },
  timeView: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    marginLeft: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  timeText: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  timeValue: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    paddingTop: moderateScale(2),
  },
  endContent: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  endText: {
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    width: "15%",
  },
  endValue: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderWidth: 1,
    borderColor: "#CFD3D4",
    borderRadius: 8,
    marginLeft: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  datePlaceholder: {
    fontSize: THEMES.fonts.font10,
    color: THEMES.colors.darkGrey,
    fontFamily: THEMES.fontFamily.medium,
  },
  value: {
    fontSize: THEMES.fonts.font12,
    color: THEMES.colors.black,
    fontFamily: THEMES.fontFamily.medium,
    paddingTop: moderateScale(5),
  },
});

export default CreateEvent;
