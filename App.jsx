/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";

import Routes from "./src/navigations/routes";
import configureStore from "./src/redux-store/store";
import Api from "./src/api/Api";
import { decryptService, encryptService } from "./src/utils/storageFunc";
import { getCurrentLocation } from "./src/utils/geolocationUtils";
import { refreshToken } from "./src/redux-store/actions/auth";
import Loader from "./src/components/Loader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { requestNotificationPermission } from "./src/utils/permissionUtils";
import {
  createNotificationChannel,
  getNotificationToken,
} from "./src/utils/pushNotificationUtils";
import { UserProvider } from "./src/api/UserContext";
import { navigate } from "./src/navigations/rootNavigationRef";

const store = configureStore();

function App() {
  const initInterceptors = useCallback(() => {
    axios.interceptors?.response?.use(
      async (response) => {
        const originalRequest = response.config;
        if (response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          const token = await decryptService("tokenId");
          const deviceId = await decryptService("deviceId");
          const currentPosition = await getCurrentLocation();
          let fcmToken = await decryptService("@fcmToken");
          if (!fcmToken) {
            fcmToken = await getNotificationToken();
            await encryptService("@fcmToken", fcmToken);
          }
          const params = {
            token: token,
            Deviceid: deviceId,
            sessionId: fcmToken,
            latitude: currentPosition?.coords?.latitude
              ? currentPosition?.coords?.latitude?.toString()
              : "0",
            longitude: currentPosition?.coords?.longitude
              ? currentPosition?.coords?.longitude?.toString()
              : "0",
          };
          const res = await refreshToken(params);
          if (res?.status === 200) {
            await encryptService("accessToken", res?.data?.data?.token);
            await encryptService("tokenId", res?.data?.data?.tokenId);
            const header = {
              AccessToken: `${res?.data?.data?.token}`,
            };
            Api.defaultHeader(header);
          } else {
            navigate("app");
          }
          return response;
        } else {
          return response;
        }
      },
      (error) => {
        return error;
      }
    );
  }, []);

  const initHeaders = useCallback(async () => {
    const token = await decryptService("accessToken");
    const header = {
      AccessToken: `${token}`,
    };
    Api.defaultHeader(header);
  }, []);

  const initPermissions = async () => {
    const permission = await requestNotificationPermission();
    if (permission) {
      const op = await createNotificationChannel();
    }
  };

  useEffect(() => {
    initHeaders();
    initInterceptors();
    initPermissions();
  }, [initInterceptors, initHeaders]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <UserProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Loader>
                <Routes />
              </Loader>
              <Toast />
            </GestureHandlerRootView>
          </UserProvider>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
