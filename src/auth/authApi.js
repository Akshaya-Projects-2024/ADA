import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../constants/config";
import { decryptService, encryptService } from "../utils/storageFunc";
import api from "./api";
import { urlList } from "../constants/urlList";

// Create an Axios instance
const authApi = axios.create({
  baseURL: `${config.baseUrl}/`, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",

  },
});

// Request interceptor to add token to headers
authApi.interceptors.request.use(
  async (req) => {
    const token = await decryptService("accessToken");
    req.headers.AccessToken = `${token}`;
    return req;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

// Response interceptor to handle token expiration
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const refreshToken = await decryptService("tokenId");
      const deviceId = await decryptService("deviceId");
      console.log("deviceId", deviceId)
      try {

        let data = {
          url: urlList.refreshToken,
          method: "POST",
          data: {
            token: refreshToken,
            Deviceid: deviceId,
          },
        };
        const res = await api(data);
        await encryptService(
          "accessToken",
          res?.data?.data?.token
        );
        await encryptService("tokenId", res?.data?.data?.tokenId);

        // // Update original request with new token
        originalRequest.headers.AccessToken = `${res?.data?.data?.token}`;

        // // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error (e.g., logout user, redirect to login, etc.)
        console.error("Failed to refresh token", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error?.response);
  }
);

export default authApi;
