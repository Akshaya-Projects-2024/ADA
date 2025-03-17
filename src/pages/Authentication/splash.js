import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { decryptService } from "../../utils/storageFunc";
import { getProfile } from "../../redux-store/actions/auth";
import {
  dispatchUserData,
  getServiceProviderRole,
} from "../../redux-store/actions/registerAction";
import { useDispatch } from "react-redux";
import { showToast } from "../../utils/utils";
import {
  getLoggedInMoodule,
  validateParentProfile,
  validateServiceProfile,
} from "../../utils/userUtils";
import { LoginModules } from "../../constants/enums";
import DeviceInfo from "react-native-device-info";
import { getCurrentLocation } from "../../utils/geolocationUtils";
import SharedPreferences from "react-native-shared-preferences";

const Splash = (props) => {
  const timeoutRef = useRef();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const bannerHeight = useMemo(() => {
    const newHeight = Math.floor((width / 1440) * 3200);
    return newHeight;
  }, [width]);

  const delay = useCallback(
    async (func) => {
      // const firstBootCompleted = await decryptService("firstBootCompleted");
      SharedPreferences.getItem("firstBootCompleted", (value) => {
        const firstBootCompleted = JSON.parse(value);
        if (firstBootCompleted) {
          if (timeoutRef?.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(func, 1500);
        } else {
          timeoutRef.current = setTimeout(
            () =>
              props?.navigation.replace("intro", {
                func: func,
              }),
            1500
          );
        }
      });
    },
    [props?.navigation]
  );

  useEffect(() => {
    if (isFocused) {
      checkIfUserExits();
      dispatch(getServiceProviderRole());
    }
  }, [isFocused, checkIfUserExits, dispatch]);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    const location = await getCurrentLocation();
  };

  const initData = useCallback(() => {
    return new Promise(async (resolve) => {
      try {
        const obj = {
          userid: await decryptService("userId"),
        };
        const response = await getProfile(obj);
        if (response?.status === 200) {
          dispatch(dispatchUserData(response?.data?.data));
        }
        resolve(response?.data?.data ? response?.data?.data : false);
      } catch (error) {
        resolve(false);
      }
    });
  }, [dispatch]);

  const navigateToHome = () => {
    delay(() =>
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: "auth",
            state: {
              routes: [
                {
                  name: "home",
                },
              ],
            },
          },
        ],
      })
    );
  };

  const navigateToParentApp = () =>
    delay(() =>
      props.navigation.reset({
        index: 0,
        routes: [{ name: "petParentAppStack" }],
      })
    );

  const navigateToAuth = (screen) =>
    delay(() => props.navigation.replace("auth", { screen }));

  const checkIfUserExits = useCallback(async () => {
    const data = await decryptService("accessToken");
    const loggedInModule = await getLoggedInMoodule();
    if (data) {
      const userData = await initData();
      const validProfile = validateParentProfile(userData);
      const validProviderProfile = validateServiceProfile(userData); //pass true as an argument for testing purpose till payment part is done
      const isProviderRegisterLater = await decryptService(
        "isPetProviderRegisterLater"
      );
      const isPetParentRegisterLater = await decryptService(
        "isPetParentRegisterLater"
      );
      if (validProfile?.flag && validProviderProfile?.flag) {
        if (loggedInModule && loggedInModule === LoginModules.parent) {
          navigateToParentApp();
        } else {
          navigateToHome();
        }
      } else if (validProviderProfile?.flag && loggedInModule === "provider") {
        navigateToHome();
      } else if (validProfile?.flag && loggedInModule === "parent") {
        navigateToParentApp();
      } else if (
        (!validProviderProfile?.flag &&
          validProviderProfile?.partiallyCompleted) ||
        loggedInModule === "provider"
      ) {
        if (isProviderRegisterLater == false) {
          showToast("error", "Please complete your registration");
          delay(() =>
            props.navigation.replace("auth", {
              screen: validProviderProfile?.navigateTo,
            })
          );
        } else {
          navigateToHome();
        }
      } else if (
        (!validProfile?.flag && validProfile?.partiallyCompleted) ||
        loggedInModule === "parent"
      ) {
        if (isPetParentRegisterLater == false) {
          showToast("error", "Please complete your registration");
          navigateToAuth(validProfile?.navigateTo);
        } else {
          navigateToParentApp();
        }
      } else {
        delay(() => props?.navigation.replace("auth"));
      }
    } else {
      delay(() => props?.navigation.replace("app"));
    }
  }, [delay, initData, props.navigation]);

  return (
    <View style={styles.flex}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"dark-content"}
      />
      <Image
        style={StyleSheet.flatten([
          styles.absolute,
          { width: width, height: bannerHeight },
        ])}
        source={require("../../assets/images/Splash.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  absolute: { position: "absolute" },
});
export default Splash;
