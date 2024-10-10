import { config } from "constants/config";
import { urlList } from "constants/urlList";
import {
  SERVICE_PROVIDER_DATA,
  SERVICE_PROVIDER_DATA_SUCCESS,
  SERVICE_PROVIDER_DATA_ERROR,
} from "../types";
import authApi from "../../auth/authApi";

export const saveRegisterData = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SERVICE_PROVIDER_DATA_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SERVICE_PROVIDER_DATA_ERROR,
        payload: data,
      });
    }
  };
};
