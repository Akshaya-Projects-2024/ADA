import React, { useState, useRef, useMemo } from "react";
import { View, Text, StatusBar, StyleSheet, ScrollView } from "react-native";
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

const Chat = () => {
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
            <View style={styles.dates}>
              <View style={{ paddingRight: moderateScale(9) }}>
                <Text style={styles.selectDateText}>Select Date</Text>
                <Text style={styles.dateText}>01/12/2024</Text>
              </View>
              <Calendar />
            </View>
            <View style={styles.timeView}>
              <View style={{ paddingRight: moderateScale(9) }}>
                <Text style={styles.timeText}>Time</Text>
                <Text style={styles.timeValue}>09:56 AM</Text>
              </View>
              <Time />
            </View>
          </View>

          <View style={styles.endContent}>
            <Text style={styles.endText}>End</Text>
            <View style={styles.endValue}>
              <View style={{ paddingRight: moderateScale(9) }}>
                <Text style={styles.datePlaceholder}>Select Date</Text>
                <Text style={styles.value}>01/12/2024</Text>
              </View>
              <Calendar />
            </View>
            <View style={styles.endValue}>
              <View style={{ paddingRight: moderateScale(9) }}>
                <Text style={styles.datePlaceholder}>Time</Text>
                <Text style={styles.value}>09:56 AM</Text>
              </View>
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
      </ScrollView>
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
    backgroundColor: THEMES.colors.white,
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
    paddingTop: moderateScale(5),
  },
  endContent: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEMES.colors.white,
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

export default Chat;
