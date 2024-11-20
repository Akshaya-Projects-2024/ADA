import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { decryptService } from "../../utils/storageFunc";
import { THEMES } from "../../assets/theme/themes";
import { screenHeight, screenWidth } from "../../utils/dimensions";
import { getProfile } from "../../redux-store/actions/auth";
import { dispatchUserData } from "../../redux-store/actions/registerAction";
import { useDispatch } from "react-redux";
import { showToast, validArray } from "../../utils/utils";
import { DOCUMENT_TYPES } from "../Account/uploadImagesDocs";
import { SHIFTS } from "../../components/TimeTracker";

const Splash = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  // useFocusEffect(
  //   useCallback(() => {
  //     checkIfUserExits();
  //   }, [])
  // );

  useEffect(() => {
    if (isFocused) {
      checkIfUserExits();
    }
  }, [isFocused, checkIfUserExits]);

  const initData = useCallback(() => {
    return new Promise(async (resolve) => {
      try {
        // resolve({});
        const obj = {
          userid: await decryptService("userId"),
        };
        const response = await getProfile(obj);
        if (response?.data?.status_code == 200) {
          // dispatch(saveRegisterData(response?.data?.data)); No need
          dispatch(dispatchUserData(response?.data?.data));
        }
        resolve(response?.data?.data ? response?.data?.data : false);
      } catch (error) {
        console.log("err111", error);
        resolve(false);
      }
    });
  }, [dispatch]);

  const validateDocuments = (docs) => {
    const doc = docs?.some(
      (it) => it?.documenttype === DOCUMENT_TYPES.document
    );
    const image = docs?.some((it) => it?.documenttype === DOCUMENT_TYPES.image);
    const logo = docs?.some((it) => it?.documenttype === DOCUMENT_TYPES.logo);
    return doc && image && logo;
  };

  const validMonthSession = (ProviderSession, sessionRateDetails) => {
    const isChargesAvailable = sessionRateDetails?.some(
      (rateDetail) =>
        rateDetail.monthcharges && rateDetail.monthcharges !== "0.00"
    );
    if (
      ProviderSession?.ispermonth &&
      (!ProviderSession?.monthtime || !isChargesAvailable)
    ) {
      return false;
    }
    return true;
  };

  const validPerSession = (ProviderSession, sessionRateDetails) => {
    const isChargesAvailable = sessionRateDetails?.some(
      (rateDetail) =>
        rateDetail.sessioncharges && rateDetail.sessioncharges !== "0.00"
    );
    if (
      ProviderSession?.ispermonth &&
      (!ProviderSession?.sessiontime || !isChargesAvailable)
    ) {
      return false;
    }
    return true;
  };

  const validateTimeData = (times) => {
    for (let index = 0; index < times.length; index++) {
      const element = times[index];
      if (
        element?.selected &&
        element?.isfullday === SHIFTS.full &&
        (!element?.shift1?.start || !element?.shift1?.end)
      ) {
        return false;
      }
      if (
        element?.selected &&
        element?.isfullday === SHIFTS.shifts &&
        (!element?.shift1?.start ||
          !element?.shift1?.end ||
          !element?.shift2?.start ||
          !element?.shift2?.end)
      ) {
        return false;
      }
    }
    return true;
  };

  const validateServiceProfile = (userData) => {
    //ProviderSession, sessionRateDetails
    if (
      !userData?.providerProfile?.providerBusiness?.name ||
      !validArray(userData?.providerProfile?.providerBusiness?.services) ||
      !userData?.providerProfile?.providerBusiness?.experience ||
      !userData?.providerProfile?.providerBusiness?.description
    ) {
      return { flag: false, navigateTo: "businessDetail" };
    }
    if (
      !userData?.providerProfile?.providerContact?.address ||
      !userData?.providerProfile?.providerContact?.email ||
      !userData?.providerProfile?.providerContact?.location ||
      !userData?.providerProfile?.providerContact?.mobile ||
      !userData?.providerProfile?.providerContact?.pin
    ) {
      return { flag: false, navigateTo: "contactDetails" };
    }
    if (
      !validArray(userData?.providerProfile?.providerDocument) ||
      !validateDocuments(userData?.providerProfile?.providerDocument)
    ) {
      return { flag: false, navigateTo: "uploadImagesDocs" };
    }
    if (
      !validArray(userData?.providerProfile?.ProviderSession?.availableat) ||
      !validMonthSession(
        userData?.providerProfile?.ProviderSession,
        userData?.providerProfile?.sessionRateDetails
      ) ||
      !validPerSession(
        userData?.providerProfile?.ProviderSession,
        userData?.providerProfile?.sessionRateDetails
      )
    ) {
      return { flag: false, navigateTo: "sessionDetail" };
    }
    if (
      !validArray(userData?.providerProfile?.sessionDetails) ||
      !validateTimeData(userData?.providerProfile?.sessionDetails)
    ) {
      return { flag: false, navigateTo: "workingHours" };
    }
    if (
      !userData?.providerProfile?.MediaLinks?.facebook ||
      !userData?.providerProfile?.MediaLinks?.instagram ||
      !userData?.providerProfile?.MediaLinks?.onlinelink ||
      !userData?.providerProfile?.MediaLinks?.website
    ) {
      return { flag: false, navigateTo: "mediaLink" };
    }
    if (
      !userData?.providerProfile?.subscription?.status ||
      userData?.providerProfile?.subscription?.status === "inactive"
    ) {
      return { flag: false, navigateTo: "paymentsSubscription" };
    }
    return { flag: true };
  };

  const validateParentProfile = (userData) => {
    // ["parentContact", "petDetails", "subscription"]
    return { flag: true };
  }; //parentProfie

  const checkIfUserExits = useCallback(async () => {
    const data = await decryptService("accessToken");
    if (data) {
      const userData = await initData();
      console.log(
        "🚀 ~ checkIfUserExits ~ userData:",
        Object.keys(userData?.parentProfie)
      );

      const validProfile = validateParentProfile(userData);
      const validProviderProfile = validateServiceProfile(userData);
      if (validProfile?.flag && validProviderProfile?.flag) {
        props.navigation.navigate("auth", {
          screen: "home",
        });
      } else if (validProviderProfile?.flag) {
        setTimeout(() => {
          props.navigation.navigate("auth", {
            screen: "home",
          });
        }, 200);
      } else if (validProfile?.flag) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "petParentAppStack" }],
        });
      } else if (!validProviderProfile?.flag) {
        showToast("error", "Please complete your registration");
        setTimeout(() => {
          props.navigation.navigate("auth", {
            screen: validProviderProfile?.navigateTo,
          });
        }, 200);
      } else if (!validProfile?.flag) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "petParentAppStack" }],
        });
      } else {
        props?.navigation.replace("auth");
      }
    } else {
      props?.navigation.replace("app");
    }
  }, [initData, props.navigation]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#04DBB0"} />
      <ImageBackground
        source={require("../../assets/images/splashS.png")}
        style={styles.img}
      >
        <Text style={styles.appText}>ADA</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  appText: {
    color: THEMES.colors.white,
    paddingTop: moderateScale(20),
    fontSize: moderateScale(50),
    fontFamily: THEMES.fontFamily.semiBold,
  },
  img: {
    width: screenWidth,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Splash;
