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
import Stepper from "../../components/Stepper";
import {
  saveSession,
  saveSessionCharges,
} from "../../redux-store/actions/auth";
import { decryptService } from "../../utils/storageFunc";
import { showToast, validArray } from "../../utils/utils";
import { useSelector } from "react-redux";
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
  const { providerProfile } = useSelector((state) => state?.commonReducer);
  const { ProviderSession, sessionRateDetails } = providerProfile;

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
    const sessionRates = sessionRateDetails[0];
    //TODO remove this once api is working properly
    if (ProviderSession?.availableat) {
      setHomeVisit(true);
    }
    //TODO Uncomment this once api is working properly
    // if (validArray(ProviderSession?.availableat)) {
    //   for (
    //     let index = 0;
    //     index < ProviderSession?.availableat.length;
    //     index++
    //   ) {
    //     const element = ProviderSession?.availableat[index];
    //     if (element ==== SESSION_AVAILABILITY.home) {
    //       setHomeVisit(true);
    //     }
    //     if (element ==== SESSION_AVAILABILITY.center) {
    //       setCenterService(true);
    //     }
    //     if (element ==== SESSION_AVAILABILITY.online) {
    //       setOnlineConsultation(true);
    //     }
    //   }
    // }
    if (ProviderSession?.ispermonth) {
      setPerMonth(true);
    }
    if (ProviderSession?.ispersession) {
      setPerSession(true);
    }
    if (ProviderSession?.monthtime) {
      setMonthTime(ProviderSession?.monthtime ? ProviderSession?.monthtime : "0");
    }
    if (ProviderSession?.sessiontime) {
      setSessionTime(ProviderSession?.sessiontime);
    }
    if (sessionRates?.monthcharges) {
      setMonthCharges(sessionRates?.monthcharges);
    }
    if (sessionRates?.sessioncharges) {
      setSessionCharges(sessionRates?.sessioncharges);
    }
  };

  const getAvailability = () => {
    //TODO remove this once api is working properly
    return SESSION_AVAILABILITY.home;
    //TODO Uncomment this once api is working properly
    // const output = [];
    // if (homeVisit) {
    //   output.push(SESSION_AVAILABILITY.home);
    // }
    // if (centerService) {
    //   output.push(SESSION_AVAILABILITY.center);
    // }
    // if (onlineConsultation) {
    //   output.push(SESSION_AVAILABILITY.online);
    // }
    // return output;
  };

  const onSubmit = async () => {
    try {
      const userId = await decryptService("userId");
      const sessionData = {
        userid: userId,
      };
      const sessionCharge = {
        userid: userId,
        // TODO what to do with this service code and subservicecode
        servicecode: "101",
        subservicecode: "",
      };
      if (!homeVisit && !centerService && !onlineConsultation) {
        showToast(
          "error",
          "Please select at least one option for availability"
        );
      } else if (!perSession && !perMonth) {
        showToast("error", "Please select at least one option for charges");
      } else {
        if (perSession) {
          // TODO pending
          // if (!sessionServiceName) {
          // } else
          if (!sessionCharges) {
            showToast("error", "Please provide per session charges");
          } else if (!sessionTime) {
            showToast("error", "Please provide per session time");
          } else {
            sessionData.ispersession = 1;
            sessionData.sessiontime = sessionTime;
            sessionCharge.sessioncharges = sessionCharges;
          }
        }
        if (perMonth) {
          // TODO pending
          // if (!monthServiceName) {
          // } else
          if (!monthCharges) {
            showToast("error", "Please provide per month charges");
          } else if (!monthTime) {
            showToast("error", "Please provide per month time");
          } else {
            sessionData.ispermonth = 1;
            sessionData.monthtime = monthTime;
            sessionCharge.monthcharges = monthCharges;
          }
        }
        sessionData.availableat = getAvailability();
        const responses = await Promise.all([
          saveSession(sessionData),
          saveSessionCharges(sessionCharge),
        ]);
        const sessionRes = responses[0];
        const sessionChargesRes = responses[1];
        if (
          sessionRes?.data?.status_code === 200 &&
          sessionChargesRes?.data?.status_code === 200
        ) {
          props.navigation.navigate("workingHours");
        } else {
          showToast(
            "error",
            sessionRes?.data?.message || sessionChargesRes?.data?.message
          );
        }
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
          style={styles.flex}
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
              style={styles.flex}
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
              style={styles.flex}
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
              style={styles.flex}
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
              style={styles.flex}
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
              style={styles.flex}
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
  flex: { flex: 1 },
});

export default SessionDetail;
