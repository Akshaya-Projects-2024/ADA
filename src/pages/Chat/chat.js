import React, { useState, useRef, useMemo } from "react";
import { View, Text, StatusBar, StyleSheet, ScrollView } from "react-native";
import Calendar from "../../assets/svg/calendar_event.svg";
import Time from "../../assets/svg/circle_event.svg";
import { THEMES } from "../../assets/theme/themes";
import Strings from "../../constants/strings";
import Header from "../../components/Header";
import FilterModal from "../../components/FilterModal";
import { moderateScale } from "react-native-size-matters";
import InputField from "../../components/InputField";
import ClipboardPaste from "../../assets/svg/clipboardPaste.svg";
import ArrowDown from "../../assets/svg/arrowDown.svg";
import CreateEvent from "../Events/createEvent";

const Chat = () => {
  return (
    <Text>hleo</Text>
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
