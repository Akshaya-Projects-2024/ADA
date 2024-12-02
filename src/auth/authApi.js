import axios from "axios";
import { config } from "../constants/config";
import { decryptService, encryptService } from "../utils/storageFunc";
import { getCurrentLocation } from "../utils/geolocationUtils";
import { refreshToken } from "../redux-store/actions/auth";

const connectionTimeout = 20000;
// Create an Axios instance
const authApi = axios.create({
  baseURL: `${config.baseUrl}/`, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: connectionTimeout,
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

authApi?.interceptors?.response?.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.status === 403 && !originalRequest._retry) {
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

      if (res?.status === 200) {
        await encryptService("accessToken", res?.data?.data?.token);
        await encryptService("tokenId", res?.data?.data?.tokenId);
      }
    }

    return error;
  }
);

export default authApi;
