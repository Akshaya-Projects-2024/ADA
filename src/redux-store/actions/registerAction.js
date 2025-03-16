import { urlList } from "../../constants/urlList";
import {
  SERVICE_PROVIDER_DATA,
  SERVICE_PROVIDER_DATA_SUCCESS,
  SERVICE_PROVIDER_DATA_ERROR,
  SERVICE_PROVIDER_ROLE,
  SERVICE_PROVIDER_ROLE_SUCCESS,
  SERVICE_PROVIDER_ROLE_ERROR,
  PROFILE_DATA,
  REFRESH_USER_DATA,
} from "../types";
import Api from "../../api/Api";
import { decryptService } from "../../utils/storageFunc";
import { getProfile } from "./auth";

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
        payload: error,
      });
    }
  };
};

export const dispatchUserData = (data) => {
  return (dispatch) => {
    dispatch({
      type: PROFILE_DATA,
      payload: data,
    });
  };
};

export const getServiceProviderRole = () => {
  return async (dispatch) => {
    try {
      let data = {
        service: "",
      };
      const res = await Api.POST(urlList.getMasterData, data);
      if (res?.status === 200) {
        if (res?.data?.data?.length) {
          let apiData = res.data.data;
          const categoryData = apiData.map((item) => ({
            id: item.code,
            label: item.service,
          }));
          dispatch({
            type: SERVICE_PROVIDER_ROLE_SUCCESS,
            payload: categoryData,
          });
        } else {
          dispatch({
            type: SERVICE_PROVIDER_ROLE_ERROR,
            payload: [],
          });
        }
      } else {
        dispatch({
          type: SERVICE_PROVIDER_ROLE_ERROR,
          payload: [],
        });
      }
    } catch (err) {
      dispatch({
        type: SERVICE_PROVIDER_ROLE_ERROR,
        payload: [],
      });
    }
  };
};

export const fetchUserProfileData = () => {
  return async (dispatch) => {
    try {
      const obj = {
        userid: await decryptService("userId"),
      };
      const response = await getProfile(obj);
      if (response?.data?.status_code === 200) {
        dispatch(dispatchUserData(response?.data?.data));
      }
    } catch (error) {}
  };
};

export const updateProfileData = (data) => {
  return async (dispatch) => {
    dispatch({
      type: REFRESH_USER_DATA,
      payload: [],
    });
  };
};
