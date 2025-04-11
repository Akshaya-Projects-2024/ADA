import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { moderateScale } from "react-native-size-matters";

import Stepper from "../../components/Stepper";
import Header from "../../components/Header";
import Strings from "../../constants/strings";
import Button from "../../components/Button";
import TimeTracker, { DAYS, SHIFTS } from "../../components/TimeTracker";
import { THEMES } from "../../assets/theme/themes";
import { decryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";
import { saveSessionDetails } from "../../redux-store/actions/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import { useUser } from "../../api/UserContext";

// Add these imports at the top
import Dialog from "../../components/Dialog";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

const WorkingHours = (props) => {
  const route = props?.route?.params?.route;
  // const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedShiftType, setSelectedShiftType] = useState(SHIFTS.full);
  const [selectedForAll, setSelectedForAll] = useState(true);
  const [times, setTimes] = useState(
    DAYS.map((it) => {
      return {
        label: it.key,
        shift1: { start: "", end: "" },
        shift2: { start: "", end: "" },
        selected: false,
        value: it.value,
      };
    })
  );
  const { apiInitCall } = useUser();
  const { providerProfile } = useSelector((state) => state?.commonReducer);
  const { sessionDetails } = providerProfile;
  // Add these state variables after other states
  const [isSubmit, setIsSubmit] = useState(true);
  const [editModal, setEditModal] = useState(false);

  // Add edit popup function
  const editPopup = () => {
    setEditModal(true);
  };
  useEffect(() => {
    initData();
    // const keyboardDidShowListener = Keyboard.addListener(
    //   "keyboardDidShow",
    //   () => {
    //     setKeyboardVisible(true); // Keyboard is visible
    //   }
    // );
    // const keyboardDidHideListener = Keyboard.addListener(
    //   "keyboardDidHide",
    //   () => {
    //     setKeyboardVisible(false); // Keyboard is hidden
    //   }
    // );

    // return () => {
    //   keyboardDidHideListener.remove();
    //   keyboardDidShowListener.remove();
    // };
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
      const outputObj = output.find((it) => it?.value === element?.day);
      const outputIndex = output.findIndex((it) => it?.value === element?.day);
      if (outputObj) {
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
        output[outputIndex] = outputObj;
      }
    }
    setTimes(output);
  };

  useEffect(() => {
    times && setSelectedForAll(areShiftsConsistent(times));
  }, [times]);

  function areShiftsConsistent(days) {
    const selectedDays = days.filter((day) => day.selected);

    if (selectedDays.length === 0) return false;

    const { start: shift1Start, end: shift1End } = selectedDays[0].shift1;
    const { start: shift2Start, end: shift2End } = selectedDays[0].shift2;

    return selectedDays.every((day) =>
      selectedShiftType === SHIFTS.full
        ? day.shift1.start === shift1Start && day.shift1.end === shift1End
        : day.shift1.start === shift1Start &&
          day.shift1.end === shift1End &&
          day.shift2.start === shift2Start &&
          day.shift2.end === shift2End
    );
  }

  const processTime = () => {
    const output = [];
    for (let index = 0; index < times?.length; index++) {
      const element = times[index];
      if (element.selected) {
        if (selectedShiftType === SHIFTS.full) {
          const outputObj = {};
          outputObj.day = element.value;
          outputObj.type = "fullday";
          outputObj.isfullday = 1;
          outputObj.start = element?.shift1?.start;
          outputObj.close = element?.shift1?.end;
          output.push(outputObj);
        } else {
          for (let indx = 0; indx < 2; indx++) {
            const outputObj = {};
            outputObj.day = element.value;
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

  const validateData = () => {
    const flag = times.some((it) => it?.selected);
    if (!flag) {
      throw new Error("Please Select at least one day");
    }
    if (!selectedShiftType) {
      throw new Error("Please Select Shift");
    }
    for (let index = 0; index < times.length; index++) {
      const element = times[index];
      if (
        element?.selected &&
        selectedShiftType === SHIFTS.full &&
        (!element?.shift1?.start || !element?.shift1?.end)
      ) {
        throw new Error("Please Enter Shift Data");
      }
      if (
        element?.selected &&
        selectedShiftType === SHIFTS.shifts &&
        (!element?.shift1?.start ||
          !element?.shift1?.end ||
          !element?.shift2?.start ||
          !element?.shift2?.end)
      ) {
        throw new Error("Please Enter Shift Data");
      }
    }
    return true;
  };

  const onSubmit = async () => {
    try {
      if (validateData()) {
        const userId = await decryptService("userId");
        processTime();
        const pramas = {
          userid: userId,
          sessionDetails: processTime(),
        };
        const response = await saveSessionDetails(pramas);
        if (response?.data?.status_code == 200) {
          if (route === "myprofile") {
            props.navigation.dispatch(StackActions.pop(2));
          } else {
            props.navigation.navigate(
              "mediaLink",
              route ? { route: route } : {}
            );
          }
        } else {
          showToast("error", response?.data?.message);
        }
        apiInitCall();
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      showToast("error", error?.message || "Enter all required Fields!!");
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <StatusBar backgroundColor={THEMES.colors.bgColor} />
        <Header title={"Working Days & Time"} showBack bgColor="transparent" />

        {route !== "myprofile" && (
          <View style={styles.stepper}>
            <Stepper currentStep={5} totalSteps={6} />
          </View>
        )}
        <View style={styles.contentStyle}>
          <ScrollView
            style={styles.flex}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View pointerEvents={isSubmit ? "auto" : "none"}>
              <TimeTracker
                times={times}
                setTimes={setTimes}
                selectedForAll={selectedForAll}
                setSelectedForAll={setSelectedForAll}
                selectedShiftType={selectedShiftType}
                setSelectedShiftType={setSelectedShiftType}
              />
            </View>
            {(route !== "myprofile" || isSubmit) && (
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
            )}
          </ScrollView>
        </View>

        <Dialog
          flag={editModal}
          description={"Are you sure you want to edit these working hours?"}
          leftButtonText="No"
          rightButtonText="Yes"
          leftButtonPressed={() => {
            setEditModal(false);
            setIsSubmit(false);
          }}
          rightButtonPressed={() => {
            setIsSubmit(true);
            setEditModal(false);
          }}
          onClose={() => setEditModal(false)}
          title="Edit Working Hours"
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
  flex: {
    flex: 1,
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
  stepper: {
    borderTopWidth: 1,
    borderTopColor: "#B8B8B8",
    borderBottomColor: "#B8B8B8",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  contentStyle: { flex: 1, paddingHorizontal: moderateScale(20) },
});

export default WorkingHours;
