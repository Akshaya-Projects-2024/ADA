import React, { useState, useEffect, useRef } from "react";
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
import ModalDropdown from "../../components/ModalDropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../api/UserContext";
import { isValidNumber, validateMinutes } from "../../utils/validation";
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
  const { providerProfile } = useSelector((state) => state?.commonReducer);
  const { ProviderSession, sessionRateDetails } = providerProfile;
  const { userData, apiInitCall } = useUser();
  const [sessionData, setSessionData] = useState({
    perSession: [],
    perMonth: [],
  });

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
    //TODO remove this once api is working properly
    // if (ProviderSession?.availableat) {
    //   setHomeVisit(true);
    // }
    //TODO Uncomment this once api is working properly
    // Check session availability efficiently
    if (validArray(ProviderSession?.availableat)) {
      const availableAt = ProviderSession.availableat;
      setHomeVisit(availableAt.includes(SESSION_AVAILABILITY.home));
      setCenterService(availableAt.includes(SESSION_AVAILABILITY.center));
      setOnlineConsultation(availableAt.includes(SESSION_AVAILABILITY.online));
    }

    const isPerSession = !!ProviderSession?.ispersession;
    const isPerMonth = !!ProviderSession?.ispermonth;
    setPerSession(isPerSession);
    setPerMonth(isPerMonth);
    const services = userData?.providerProfile?.providerBusiness?.services;
    if (services?.length) {
      const { perSession, perMonth } = services.reduce(
        (acc, { code: serviceCode, service: serviceName }) => {
          const matchingRates =
            sessionRateDetails?.filter((x) => x.servicecode === serviceCode) ||
            [];

          if (matchingRates.length) {
            matchingRates.forEach(
              ({ sessioncharges, sessiontime, monthcharges, monthtime }) => {
                if (sessioncharges !== "0")
                  acc.perSession.push({
                    serviceName,
                    serviceCode,
                    sessioncharges,
                    sessiontime,
                  });
                if (monthcharges !== "0")
                  acc.perMonth.push({
                    serviceName,
                    serviceCode,
                    monthcharges,
                    monthtime,
                  });
              }
            );
          } else {
            if (isPerSession)
              acc.perSession.push({
                serviceName,
                serviceCode,
                sessioncharges: "",
                sessiontime: "",
              });
            if (isPerMonth)
              acc.perMonth.push({
                serviceName,
                serviceCode,
                monthcharges: "",
                monthtime: "",
              });
          }
          return acc;
        },
        { perSession: [], perMonth: [] }
      );

      setSessionData({ perSession, perMonth });
    }
  };

  const getAvailability = () => {
    //TODO remove this once api is working properly
    // return SESSION_AVAILABILITY.home;
    //TODO Uncomment this once api is working properly
    const output = [];
    if (homeVisit) {
      output.push(SESSION_AVAILABILITY.home);
    }
    if (centerService) {
      output.push(SESSION_AVAILABILITY.center);
    }
    if (onlineConsultation) {
      output.push(SESSION_AVAILABILITY.online);
    }
    return output;
  };

  const onSubmit = async () => {
    try {
      const userId = await decryptService("userId");
      let sessionRateArray = [];
      const sessionDataObj = {
        userid: userId,
        ...(ProviderSession?.id ? { id: ProviderSession?.id } : {}),
      };

      if (!homeVisit && !centerService && !onlineConsultation) {
        showToast(
          "error",
          "Please select at least one option for availability"
        );
      } else if (!perSession && !perMonth) {
        showToast("error", "Please select at least one option for charges");
      } else if (
        perSession &&
        sessionData.perSession.some((item) => !item.sessioncharges)
      ) {
        showToast("error", "Please enter charges for session");
      } else if (
        perSession &&
        sessionData.perSession.some(
          (item) => !isValidNumber(item.sessioncharges)
        )
      ) {
        showToast("error", "Please enter valid charges for session");
      } else if (
        perSession &&
        sessionData.perSession.some((item) => !item.sessiontime)
      ) {
        showToast("error", "Please enter time for session");
      } else if (
        perSession &&
        sessionData.perSession.some(
          (item) => !validateMinutes(item.sessiontime)
        )
      ) {
        showToast("error", "Please enter valid time for session");
      } else if (
        perMonth &&
        sessionData.perMonth.some((item) => !item.monthcharges)
      ) {
        showToast("error", "Please enter charges for month");
      } else if (
        perMonth &&
        sessionData.perMonth.some((item) => !isValidNumber(item.monthcharges))
      ) {
        showToast("error", "Please enter valid month charges");
      } else if (
        perMonth &&
        sessionData.perMonth.some((item) => !item.monthtime)
      ) {
        showToast("error", "Please enter time for month");
      } else if (
        perMonth &&
        sessionData.perMonth.some((item) => !validateMinutes(item.monthtime))
      ) {
        showToast("error", "Please enter valid time for month");
      } else {
        sessionDataObj.availableat = getAvailability();
        sessionDataObj.ispermonth = perMonth ? 1 : 0;
        sessionDataObj.ispersession = perSession ? 1 : 0;
        sessionDataObj.sessiontime = "0";
        sessionDataObj.monthtime = "0";

        [...sessionData.perSession, ...sessionData.perMonth].forEach((item) => {
          sessionRateArray.push({
            servicecode: item.serviceCode,
            sessioncharges: item.sessioncharges || "0",
            monthcharges: item.monthcharges || "0",
            sessiontime: item.sessiontime || "0",
            monthtime: item.monthtime || "0",
          });
        });
        const sessionCharge = {
          userid: userId,
          sessionrate: sessionRateArray,
        };
        console.log("sess", sessionData, sessionCharge);
        const responses = await Promise.all([
          saveSession(sessionDataObj),
          saveSessionCharges(sessionCharge),
        ]);
        const sessionRes = responses[0];
        const sessionChargesRes = responses[1];
        if (
          sessionRes?.data?.status_code === 200 &&
          sessionChargesRes?.data?.status_code === 200
        ) {
          props.navigation.navigate(
            "workingHours",
            route ? { route: route } : {}
          );
        } else {
          showToast(
            "error",
            sessionRes?.data?.message || sessionChargesRes?.data?.message
          );
        }
        apiInitCall();
      }
    } catch (error) {
      showToast("error", "Something went wrong!!!");
    }
  };

  const handleSessionChange = (parent, key, index, value) => {
    const tempSession = { ...sessionData };
    tempSession[parent][index][key] = value;
    setSessionData({ ...tempSession });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
                onClick={() => {
                  setPerSession(!perSession);
                  setSessionData({
                    ...sessionData,
                    perSession: !perSession
                      ? userData?.providerProfile?.providerBusiness?.services?.map(
                          (item) => ({
                            serviceName: item.service,
                            serviceCode: item.code,
                            sessioncharges: "",
                            sessiontime: "",
                          })
                        )
                      : [],
                  });
                }}
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
                isChecked={perMonth}
                style={styles.flex}
                rightText={"Per Month"}
                rightTextStyle={{
                  color: THEMES.colors.black,
                  fontSize: THEMES.fonts.font12,
                  fontFamily: THEMES.fontFamily.semiBold,
                }}
                onClick={() => {
                  setPerMonth(!perMonth);
                  setSessionData({
                    ...sessionData,
                    perMonth: !perMonth
                      ? userData?.providerProfile?.providerBusiness?.services?.map(
                          (item) => ({
                            serviceName: item.service,
                            serviceCode: item.code,
                            monthcharges: "",
                            monthtime: "",
                          })
                        )
                      : [],
                  });
                }}
              />
            </View>
            {perSession &&
              sessionData?.perSession?.map((item, index) => (
                <>
                  <View style={styles.contentView}>
                    <Text style={styles.availableText}>
                      {Strings.perSessionCharges}{" "}
                    </Text>
                  </View>
                  <View style={{ paddingTop: moderateScale(16) }}>
                    <InputField
                      label="Service provider Role*"
                      value={item?.serviceName}
                      editable={false}
                    />
                  </View>
                  <View style={{ paddingTop: moderateScale(16) }}>
                    <InputField
                      keyboardType="phone-pad"
                      label={Strings.chargesPerSession}
                      placeholderText={Strings.enterPrice}
                      value={item?.sessioncharges}
                      onChange={(value) => {
                        handleSessionChange(
                          "perSession",
                          "sessioncharges",
                          index,
                          value
                        );
                      }}
                    />
                  </View>
                  <View style={{ paddingTop: moderateScale(16) }}>
                    <InputField
                      keyboardType="phone-pad"
                      label={Strings.perDaySessionInMin}
                      placeholderText={Strings.perDaySession}
                      value={item?.sessiontime}
                      onChange={(value) => {
                        handleSessionChange(
                          "perSession",
                          "sessiontime",
                          index,
                          value
                        );
                      }}
                    />
                  </View>
                </>
              ))}
            {perMonth &&
              sessionData?.perMonth?.map((item, index) => (
                <>
                  <View style={styles.contentView}>
                    <Text style={styles.availableText}>
                      {Strings.perMonthSession}{" "}
                    </Text>
                  </View>
                  <View style={{ paddingTop: moderateScale(16) }}>
                    <InputField
                      label="Service provider Role*"
                      value={item?.serviceName}
                      editable={false}
                    />
                  </View>
                  <View style={{ paddingTop: moderateScale(16) }}>
                    <InputField
                      keyboardType="phone-pad"
                      label={Strings.chargesPerSession}
                      placeholderText={Strings.enterPrice}
                      value={item?.monthcharges}
                      onChange={(value) => {
                        handleSessionChange(
                          "perMonth",
                          "monthcharges",
                          index,
                          value
                        );
                      }}
                    />
                  </View>
                  <View style={{ paddingTop: moderateScale(16) }}>
                    <InputField
                      keyboardType="phone-pad"
                      label={Strings.perDaySessionInMin}
                      placeholderText={Strings.perDaySession}
                      value={item?.monthtime}
                      onChange={(value) => {
                        handleSessionChange(
                          "perMonth",
                          "monthtime",
                          index,
                          value
                        );
                      }}
                    />
                  </View>
                </>
              ))}

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
    </SafeAreaView>
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
