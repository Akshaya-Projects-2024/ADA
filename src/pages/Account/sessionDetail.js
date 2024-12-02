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
import ModalDropdown from "../../components/ModalDropdown";
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
  const { serviceProviderRoleData } = useSelector(({ register }) => register);
  const [serviceProviderRole, setServiceProviderRole] = useState();
  const [selectedServiceProvider, setServiceProviderValue] = useState();
  const [selectedServiceMonthProvider, setServiceProviderMonthValue] =
    useState();

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

  useEffect(() => {
    if (serviceProviderRoleData.length) {
      setServiceProviderRole(serviceProviderRoleData);
    }
  }, [serviceProviderRoleData]);

  const initData = () => {
    //TODO remove this once api is working properly
    if (ProviderSession?.availableat) {
      setHomeVisit(true);
    }
    //TODO Uncomment this once api is working properly
    if (validArray(ProviderSession?.availableat)) {
      for (
        let index = 0;
        index < ProviderSession?.availableat.length;
        index++
      ) {
        const element = ProviderSession?.availableat[index];
        if (element === SESSION_AVAILABILITY.home) {
          setHomeVisit(true);
        }
        if (element === SESSION_AVAILABILITY.center) {
          setCenterService(true);
        }
        if (element === SESSION_AVAILABILITY.online) {
          setOnlineConsultation(true);
        }
      }
    }

    if (ProviderSession?.ispermonth == 1) {
      setPerMonth(true);
    }
    if (ProviderSession?.ispersession == 1) {
      setPerSession(true);
    }

    if (ProviderSession?.monthtime) {
      setMonthTime(ProviderSession?.monthtime ? ProviderSession?.monthtime : "0");
    }
    if (ProviderSession?.sessiontime) {
      setSessionTime(ProviderSession?.sessiontime);
    }

    if (validArray(sessionRateDetails)) {
      sessionRateDetails.forEach((rateDetail) => {
        if (rateDetail.sessioncharges && rateDetail.sessioncharges !== "0.00") {
          const matchedService = serviceProviderRoleData?.find(
            (service) => service.id == rateDetail.servicecode
          );
          if (matchedService) {
            setServiceProviderValue([matchedService]);
          }
          setSessionCharges(rateDetail.sessioncharges);
        }
        if (rateDetail.monthcharges && rateDetail.monthcharges !== "0.00") {
          const matchedService = serviceProviderRoleData?.find(
            (service) => service.id == rateDetail.servicecode
          );
          if (matchedService) {
            setServiceProviderMonthValue([matchedService]);
          }
          setMonthCharges(rateDetail.monthcharges);
        }
      });
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
      const sessionData = {
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
      } else if (perSession && !selectedServiceProvider?.length) {
        showToast("error", "Please select service name for session");
      } else if (perSession && !sessionCharges) {
        showToast("error", "Please enter charges for session");
      } else if (perSession && !sessionTime) {
        showToast("error", "Please enter time for session");
      } else if (perMonth && !selectedServiceMonthProvider?.length) {
        showToast("error", "Please select service name for per month");
      } else if (perMonth && !monthCharges) {
        showToast("error", "Please enter charges for month");
      } else if (perMonth && !monthTime) {
        showToast("error", "Please enter time for month");
      } else {
        sessionData.availableat = getAvailability();
        sessionData.ispermonth = perMonth ? 1 : 0;
        sessionData.ispersession = perSession ? 1 : 0;
        sessionData.sessiontime = sessionTime ? sessionTime : "";
        sessionData.monthtime = monthTime ? monthTime : "";

        if (perSession) {
          let obj = {
            servicecode: selectedServiceProvider.length
              ? selectedServiceProvider?.[0].id
              : "",
            sessioncharges: sessionCharges ? sessionCharges : "0",
            monthcharges: "0",
          };
          sessionRateArray.push(obj);
        }

        if (perMonth) {
          let obj = {
            servicecode: selectedServiceMonthProvider.length
              ? selectedServiceMonthProvider?.[0].id
              : "",
            sessioncharges: "0",
            monthcharges: monthCharges ? monthCharges : "0",
          };
          sessionRateArray.push(obj);
        }

        const sessionCharge = {
          userid: userId,
          sessionrate: sessionRateArray,
        };
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
                <ModalDropdown
                  placeholder="Service provider Role*"
                  data={serviceProviderRole}
                  title={"Select service role"}
                  setSelectedValue={setServiceProviderValue}
                  selectedValue={selectedServiceProvider}
                  noPadding
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
                <ModalDropdown
                  placeholder="Service provider Role*"
                  data={serviceProviderRole}
                  title={"Select service role"}
                  setSelectedValue={setServiceProviderMonthValue}
                  selectedValue={selectedServiceMonthProvider}
                  noPadding
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
