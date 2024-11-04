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

const CommonScreen = () => {
  return (
    <View style={{flex:1, backgroundColor: THEMES.colors.bgColor, alignItems:'center', justifyContent:'center'}}>
      <Text style={{color:"#000", fontFamily: THEMES.fontFamily.bold, fontSize: THEMES.fonts.font16}}>Coming Soon !!!</Text>
    </View>
  );
};


export default CommonScreen;
