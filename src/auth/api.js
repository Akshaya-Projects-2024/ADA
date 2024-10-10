import axios from "axios";
import { config } from "../constants/config";

const connectionTimeout = 20000;

const api = axios.create({
  baseURL: `${config.baseUrl}/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: connectionTimeout,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

export default api;
