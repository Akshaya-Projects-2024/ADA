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
    }

    return Promise.reject(error?.response);
  }
);

export default authApi;
