import api from "../../auth/api";
import authApi from "../../auth/authApi";
import { urlList } from "../../constants/urlList";

export const checkLogin = async (obj) => {
  try {
    let data = {
      url: urlList.login,
      method: "POST",
      data: obj,
    };
    const res = await api(data);
    return res;
  } catch (error) {
    return error;
  }
};

export const verifyOtp = async (obj) => {
  try {
    let data = {
      url: urlList.verifyOTP,
      method: "POST",
      data: obj,
    };
    const res = await api(data);
    return res;
  } catch (error) {
    return error;
  }
};

export const getProfile = async (obj) => {
  try {
    let data = {
      url: urlList.getProfile,
      method: "POST",
      data: obj,
    };
    const res = await authApi(data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const saveBusinessDetails = async (obj) => {
  try {
    let data = {
      url: urlList.businessDetail,
      method: "POST",
      data: obj,
    };
    const res = await authApi(data);
    return res;
  } catch (error) {
    return error;
  }
};

export const saveContactDetails = async (obj) => {
  try {
    let data = {
      url: urlList.contactDetail,
      method: "POST",
      data: obj,
    };
    const res = await authApi(data);
    return res;
  } catch (error) {
    return error;
  }
};

export const saveMediaLinks = async (obj) => {
  try {
    let data = {
      url: urlList.mediaLink,
      method: "POST",
      data: obj,
    };
    const res = await authApi(data);
    return res;
  } catch (error) {
    return error;
  }
};

export const refreshToken = async (params) => {
  try {
    let data = {
      url: urlList.refreshToken,
      method: "POST",
      data: params,
    };
    const res = await api(data);
    return res;
  } catch (error) {
    return error;
  }
};
