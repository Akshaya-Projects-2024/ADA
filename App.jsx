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

const store = configureStore();

function App() {
  const initInterceptors = useCallback(() => {
    axios.interceptors?.response?.use(
      async (response) => {
        const originalRequest = response.config;
        console.log(
          "interceptors",
          response.config.url,
          response.status,
          response.config.headers.AccessToken
        );
        if (response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Try to refresh the token
          const token = await decryptService("tokenId");
          const deviceId = await decryptService("deviceId");
          const currentPosition = await getCurrentLocation();
          const params = {
            token: token,
            Deviceid: deviceId,
            sessionId: "localsession1", // hard coded value, we have send firebase fcm
            latitude: currentPosition?.coords?.latitude
              ? currentPosition?.coords?.latitude?.toString()
              : "0",
            longitude: currentPosition?.coords?.longitude
              ? currentPosition?.coords?.longitude?.toString()
              : "0",
          };
          const res = await refreshToken(params);
          console.log("refresh", res?.data?.data?.token);
          if (res?.status === 200) {
            await encryptService("accessToken", res?.data?.data?.token);
            await encryptService("tokenId", res?.data?.data?.tokenId);
            const header = {
              AccessToken: `${res?.data?.data?.token}`,
            };
            Api.defaultHeader(header);
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

  useEffect(() => {
    initHeaders();
    initInterceptors();
  }, [initInterceptors, initHeaders]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Routes />
          <Toast />
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
