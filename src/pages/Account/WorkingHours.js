import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from "react-native";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import TimeTracker, { DAYS, SHIFTS } from "../../components/TimeTracker";
import Stepper from "../../components/Stepper";
import { decryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";

const WorkingHours = (props) => {
  const route = props?.route?.params?.route;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedShiftType, setSelectedShiftType] = useState(SHIFTS.full);
  const [selectedForAll, setSelectedForAll] = useState(true);
  const [times, setTimes] = useState(
    DAYS.map((it) => {
      return {
        label: it,
        shift1: { start: "", end: "" },
        shift2: { start: "", end: "" },
        selected: false,
        enabled: false,
      };
    })
  );

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

  const processTime = () => {
    const output = [];
    for (let index = 0; index < times?.length; index++) {
      const element = times[index];
      const outputObj = {};
      outputObj.day = element.label;
      // outputObj.type=
    }
  };

  const onSubmit = async () => {
    try {
      const userId = await decryptService("userId");
      const pramas = {
        userid: userId,
        sessionDetails: [
          {
            day: "Mon",
            type: "1st half", //Full Day if you select fullday as working time
            start: "8:30 AM",
            close: "10:30 AM",
            isfullday: 1,
          },
          {
            day: "Mon",
            type: "2nd half",
            start: "02:30 PM",
            close: "3:30 PM",
            isfullday: 1,
          },
        ],
      };
      // props.navigation.navigate("mediaLink");
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      showToast("error", "Something went wrong!!!");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={"Working Days & TIme"} showBack bgColor="transparent" />
      {route !== "myprofile" && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#B8B8B8",
            borderBottomColor: "#B8B8B8",
            borderBottomWidth: 1,
            backgroundColor: "#fff",
          }}
        >
          <Stepper currentStep={5} totalSteps={6} />
        </View>
      )}
      <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TimeTracker
            times={times}
            setTimes={setTimes}
            selectedForAll={selectedForAll}
            setSelectedForAll={setSelectedForAll}
            selectedShiftType={selectedShiftType}
            setSelectedShiftType={setSelectedShiftType}
          />
          <View
            style={{
              paddingBottom: moderateScale(25),
              paddingTop: moderateScale(30),
            }}
          >
            <Button
              title={route !== "myprofile" ? Strings.next : Strings.submit}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEMES.colors.bgColor,
  },
  contentView: {
    paddingTop: moderateScale(27),
  },
  availableText: {
    fontFamily: THEMES.fontFamily.semiBold,
    fontSize: THEMES.fonts.font14,
    color: THEMES.colors.black,
  },
  contentValueView: {
    paddingTop: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
  },
});

export default WorkingHours;
