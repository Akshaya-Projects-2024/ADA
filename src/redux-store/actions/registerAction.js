import { urlList } from "../../constants/urlList";
import {
  SERVICE_PROVIDER_DATA,
  SERVICE_PROVIDER_DATA_SUCCESS,
  SERVICE_PROVIDER_DATA_ERROR,
  SERVICE_PROVIDER_ROLE,
  SERVICE_PROVIDER_ROLE_SUCCESS,
  SERVICE_PROVIDER_ROLE_ERROR,
} from "../types";
import authApi from "../../auth/authApi";
import Api from "../../api/Api";

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
