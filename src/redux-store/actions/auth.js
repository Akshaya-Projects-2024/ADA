import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";

export const checkLogin = async (obj) => {
  try {
    const res = await Api.POST(urlList.login, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("checkLogin Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const verifyOtp = async (obj) => {
  try {
    const res = await Api.POST(urlList.verifyOTP, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("verifyOtp Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getProfile = async (obj) => {
  try {
    const res = await Api.POST(urlList.getProfile, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("getProfile Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveBusinessDetails = async (obj) => {
  try {
    const res = await Api.POST(urlList.businessDetail, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("saveBusinessDetails Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveContactDetails = async (obj) => {
  try {
    const res = await Api.POST(urlList.contactDetail, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("saveContactDetails Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveMediaLinks = async (obj) => {
  try {
    const res = await Api.POST(urlList.mediaLink, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("saveMediaLinks Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveSession = async (obj) => {
  try {
    const res = await Api.POST(urlList.addSession, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("saveSession Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveSessionCharges = async (obj) => {
  try {
    const res = await Api.POST(urlList.saveSessionCharged, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("saveSessionCharges Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveSessionDetails = async (obj) => {
  try {
    const res = await Api.POST(urlList.addSessionDetails, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("saveSessionDetails Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const refreshToken = async (params) => {
  try {
    const res = await Api.POST(urlList.refreshToken, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("refreshToken Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const uploadDocument = async (params) => {
  try {
    const res = await Api.POST(urlList.uploadCommonDocument, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("uploadDocument Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const deleteDocument = async (params) => {
  try {
    const res = await Api.POST(urlList.deleteCommonDocument, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("deleteDocument Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const uploadParentDocument = async (params) => {
  try {
    const res = await Api.POST(urlList.parentUploadPhoto, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("uploadDocument Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const saveParentDetails = async (params) => {
  try {
    const res = await Api.POST(urlList.parentDetails, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("uploadDocument Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const savePetDetails = async (params) => {
  try {
    const res = await Api.POST(urlList.savePetDetails, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("savePetDetails Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getAdoption = async (params) => {
  try {
    const res = await Api.POST(urlList.getAllAdoption, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("getAdoption Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const addAdoption = async (params) => {
  try {
    const res = await Api.POST(urlList.addAdoption, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      return res;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("addAdoption Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};
