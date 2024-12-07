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

const Splash = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      checkIfUserExits();
      dispatch(getServiceProviderRole());
    }
  }, [isFocused, checkIfUserExits, dispatch]);

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

  const checkIfUserExits = useCallback(async () => {
    const data = await decryptService("accessToken");
    const loggedInModule = await getLoggedInMoodule();
    if (data) {
      const userData = await initData();
      const validProfile = validateParentProfile(userData);
      const validProviderProfile = validateServiceProfile(userData); //pass true as an argument for testing purpose till payment part is done
      if (validProfile?.flag && validProviderProfile?.flag) {
        if (loggedInModule && loggedInModule === LoginModules.parent) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "petParentAppStack" }],
          });
        } else {
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
          });
        }
      } else if (
        !validProfile?.flag &&
        !validProfile?.partiallyCompleted &&
        !validProviderProfile?.flag &&
        !validProviderProfile?.partiallyCompleted
      ) {
        props?.navigation.replace("auth");
      } else if (validProviderProfile?.flag) {
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
        });
      } else if (validProfile?.flag) {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "petParentAppStack" }],
        });
      } else if (
        !validProviderProfile?.flag &&
        validProviderProfile?.partiallyCompleted
      ) {
        showToast("error", "Please complete your registration");
        props.navigation.navigate("auth", {
          screen: validProviderProfile?.navigateTo,
        });
      } else if (!validProfile?.flag && validProfile?.partiallyCompleted) {
        props.navigation.navigate(validProfile?.navigateTo, {
          route: "parentAccount",
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
