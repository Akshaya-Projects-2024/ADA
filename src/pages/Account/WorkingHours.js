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
import { saveSessionDetails } from "../../redux-store/actions/auth";
import { useSelector } from "react-redux";

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
      };
    })
  );
  const { providerProfile } = useSelector((state) => state?.commonReducer);
  const { sessionDetails } = providerProfile;

  useEffect(() => {
    initData();
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

  const initData = () => {
    const output = [...times];
    for (let index = 0; index < sessionDetails.length; index++) {
      const element = sessionDetails[index];
      if (index === 0) {
        if (element?.isfullday) {
          setSelectedShiftType(SHIFTS.full);
        } else {
          setSelectedShiftType(SHIFTS.shifts);
        }
      }
      const outputObj = output.find((it) => it?.label === element?.day);
      outputObj.selected = true;
      if (!element?.isfullday) {
        if (element?.type === "1st half") {
          outputObj.shift1.start = element?.start;
          outputObj.shift1.end = element?.close;
        } else {
          outputObj.shift2.start = element?.start;
          outputObj.shift2.end = element?.close;
        }
      } else {
        outputObj.shift1.start = element?.start;
        outputObj.shift1.end = element?.close;
      }
      output[index] = outputObj;
    }
    setTimes(output);
  };

  const processTime = () => {
    const output = [];
    for (let index = 0; index < times?.length; index++) {
      const element = times[index];
      if (element.selected) {
        if (selectedShiftType === SHIFTS.full) {
          const outputObj = {};
          outputObj.day = element.label;
          outputObj.type = "fullday";
          outputObj.isfullday = 1;
          outputObj.start = element?.shift1?.start;
          outputObj.close = element?.shift1?.end;
          output.push(outputObj);
        } else {
          for (let indx = 0; indx < 2; indx++) {
            const outputObj = {};
            outputObj.day = element.label;
            outputObj.isfullday = 0;
            if (indx === 0) {
              outputObj.type = "1st half";
              outputObj.start = element?.shift1?.start;
              outputObj.close = element?.shift1?.end;
            } else {
              outputObj.type = "2nd half";
              outputObj.start = element?.shift2?.start;
              outputObj.close = element?.shift2?.end;
            }
            output.push(outputObj);
          }
        }
      }
    }
    return output;
  };

  const onSubmit = async () => {
    try {
      const userId = await decryptService("userId");
      processTime();
      const pramas = {
        userid: userId,
        sessionDetails: processTime(),
      };
      const response = await saveSessionDetails(pramas);
      if (response?.data?.status_code == 200) {
        props.navigation.navigate("mediaLink");
      } else {
        showToast("error", response?.data?.message);
      }
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
