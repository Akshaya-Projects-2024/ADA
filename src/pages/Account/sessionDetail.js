import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from "react-native";
import InputField from "../../components/InputField";
import { THEMES } from "../../assets/theme/themes";
import Header from "../../components/Header";
import Checked from "../../assets/svg/checked.svg";
import UnChecked from "../../assets/svg/unchecked.svg";
import Strings from "../../constants/strings";
import Button from "../../components/Button";
import { moderateScale } from "react-native-size-matters";
import CheckBox from "react-native-check-box";
import TimeTracker from "../../components/TimeTracker";
import Stepper from "../../components/Stepper";
import {
  saveSession,
  saveSessionDetails,
} from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { showToast } from "../../utils/utils";
const SESSION_AVAILABILITY = {
  home: "Home Visit",
  center: "At Center Service",
  online: "Online Consultation",
};
const SessionDetail = (props) => {
  const route = props?.route?.params?.route;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [homeVisit, setHomeVisit] = useState(false);
  const [centerService, setCenterService] = useState(false);
  const [onlineConsultation, setOnlineConsultation] = useState(false);
  const [perSession, setPerSession] = useState(true);
  const [perMonth, setPerMonth] = useState(false);
  const [sessionServiceName, setSessionServiceName] = useState("");
  const [sessionCharges, setSessionCharges] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [monthServiceName, setMonthServiceName] = useState("");
  const [monthCharges, setMonthCharges] = useState("");
  const [monthTime, setMonthTime] = useState("");

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

  const onSubmit = async () => {
    try {
      if (!homeVisit && !centerService && !onlineConsultation) {
        showToast(
          "error",
          "Please select at least one option for availability"
        );
      } else if (!perSession && !perMonth) {
        showToast("error", "Please select at least one option for charges");
      } else if (perSession) {
        if (!sessionServiceName) {
        } else if (!sessionCharges) {
        } else if (!sessionTime) {
        } else {
        }
      } else if (perMonth) {
        if (!monthServiceName) {
        } else if (!monthCharges) {
        } else if (!monthTime) {
        } else {
        }
      } else {
        // props.navigation.navigate("workingHours");
        const userId = await decryptService("userId");
        const sessionData = {
          userid: userId,
          availableat: "As service center",
          ispersession: 1,
          ispermonth: 1,
          isfullday: 1,
          sessiontime: "30",
          monthtime: "40",
        };
        const res = await saveSession(sessionData);
        // const sessionDetailData = [
        //   {
        //     day: "Mon",
        //     type: "1st half",
        //     start: "8:30 AM",
        //     close: "10:30 AM",
        //   },
        //   {
        //     day: "Mon",
        //     type: "2nd half",
        //     start: "02:30 PM",
        //     close: "3:30 PM",
        //   },
        // ];
        // const res2 = await saveSessionDetails(sessionDetailData);
        // if (res?.data?.status_code == 200) {
        //   props.navigation.navigate("mediaLink");
        // } else {
        //   showToast("error", res?.data?.message);
        // }
      }
    } catch (error) {
      showToast("error", "Something went wrong!!!");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEMES.colors.bgColor} />
      <Header title={Strings.sessionDetails} showBack bgColor="transparent" />
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
          <Stepper currentStep={4} totalSteps={6} />
        </View>
      )}
      <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View
            style={[
              styles.contentView,
              { paddingTop: route !== "myprofile" ? 18 : 30 },
            ]}
          >
            <Text style={styles.availableText}>
              {Strings.howYouWillBeAvailable}{" "}
            </Text>
          </View>
          <View style={styles.contentValueView}>
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setHomeVisit(!homeVisit)}
              isChecked={homeVisit}
              style={{ flex: 1 }}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
              rightText={SESSION_AVAILABILITY.home}
            />
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setCenterService(!centerService)}
              isChecked={centerService}
              style={{ flex: 1 }}
              rightText={SESSION_AVAILABILITY.center}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
            />
          </View>
          <View style={{ paddingTop: moderateScale(25) }}>
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setOnlineConsultation(!onlineConsultation)}
              isChecked={onlineConsultation}
              style={{ flex: 1 }}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
              rightText={SESSION_AVAILABILITY.online}
            />
          </View>
          <View style={styles.contentView}>
            <Text style={styles.availableText}>
              {Strings.howYouWillBeAvailable}{" "}
            </Text>
          </View>
          <View style={styles.contentValueView}>
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setPerSession(!perSession)}
              isChecked={perSession}
              style={{ flex: 1 }}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
              rightText={"Per Session"}
            />
            <CheckBox
              checkedImage={<Checked />}
              unCheckedImage={<UnChecked />}
              onClick={() => setPerMonth(!perMonth)}
              isChecked={perMonth}
              style={{ flex: 1 }}
              rightText={"Per Month"}
              rightTextStyle={{
                color: THEMES.colors.black,
                fontSize: THEMES.fonts.font12,
                fontFamily: THEMES.fontFamily.semiBold,
              }}
            />
          </View>
          {perSession && (
            <>
              <View style={styles.contentView}>
                <Text style={styles.availableText}>
                  {Strings.perSessionCharges}{" "}
                </Text>
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  label={"Service Name"}
                  placeholderText={"Enter service name"}
                  value={sessionServiceName}
                  onChange={setSessionServiceName}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  keyboardType="phone-pad"
                  label={Strings.chargesPerSession}
                  placeholderText={Strings.enterPrice}
                  value={sessionCharges}
                  onChange={setSessionCharges}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  keyboardType="phone-pad"
                  label={Strings.perDaySessionInMin}
                  placeholderText={Strings.perDaySession}
                  value={sessionTime}
                  onChange={setSessionTime}
                />
              </View>
            </>
          )}
          {perMonth && (
            <>
              <View style={styles.contentView}>
                <Text style={styles.availableText}>
                  {Strings.perMonthSession}{" "}
                </Text>
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  label={"Service Name"}
                  placeholderText={"Enter service name"}
                  value={monthServiceName}
                  onChange={setMonthServiceName}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  keyboardType="phone-pad"
                  label={Strings.chargesPerSession}
                  placeholderText={Strings.enterPrice}
                  value={monthCharges}
                  onChange={setMonthCharges}
                />
              </View>
              <View style={{ paddingTop: moderateScale(16) }}>
                <InputField
                  keyboardType="phone-pad"
                  label={Strings.perDaySessionInMin}
                  placeholderText={Strings.perDaySession}
                  value={monthTime}
                  onChange={setMonthTime}
                />
              </View>
            </>
          )}

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

export default SessionDetail;
