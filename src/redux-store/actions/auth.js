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
    console.log("verifyOtp Error! ", error?.message);
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

export const uploadProviderDocument = async (params) => {
  try {
    const res = await Api.POST(urlList.uploadDocument, params);
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
    console.log("uploadProviderDocument Error! ", error);
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
    console.log("uploadParentDocument Error! ", error);
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
    console.log("saveParentDetails Error! ", error);
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

export const getServices = async (params) => {
  try {
    const res = await Api.POST(urlList.getMasterData, params);
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
    console.log("getServices Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getProviderByService = async (params) => {
  try {
    const res = await Api.POST(urlList.getProviderByService, params);
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
    console.log("getProviderByService Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getProviderSlots = async (params) => {
  try {
    const res = await Api.POST(urlList.getProviderTimeSlots, params);
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
    console.log("getProviderSlots Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const createAppointment = async (params) => {
  try {
    const res = await Api.POST(urlList.createAppointment, params);
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
    console.log("createAppointment Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getAllAppointment = async (params) => {
  try {
    const res = await Api.POST(urlList.getAllAppointment, params);
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
    console.log("getAllAppointment Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const confirmAppointment = async (params) => {
  try {
    const res = await Api.POST(urlList.confirmAppointment, params);
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
    console.log("confirmAppointment Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const cancelAppointment = async (params) => {
  try {
    const res = await Api.POST(urlList.cancelAppointment, params);
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
    console.log("cancelAppointment Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const rescheduleAppointment = async (params) => {
  try {
    const res = await Api.POST(urlList.rescheduleAppointment, params);
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
    console.log("rescheduleAppointment Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const completeAppointment = async (params) => {
  try {
    const res = await Api.POST(urlList.completeAppointment, params);
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
    console.log("completeAppointment Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getUpcomingAppointments = async (params) => {
  try {
    const res = await Api.POST(urlList.getUpcomingAppointments, params);
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
    console.log("getUpcomingAppointments Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const providerDashboardSlotsData = async (params) => {
  try {
    const res = await Api.POST(urlList.providerDashboardSlotsData, params);
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
    console.log("providerDashboardSlotsData Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const search = async (params) => {
  try {
    const res = await Api.POST(urlList.search, params);
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
    console.log("search Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getAppointmentById = async (params) => {
  try {
    const res = await Api.POST(urlList.appointmentById, params);
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
    console.log("search Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const deleteAccountApi = async (params) => {
  try {
    const res = await Api.POST(urlList.deleteAccount, params);
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
    console.log("search Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getHolidayData = async (params) => {
  try {
    const res = await Api.POST(urlList.getHoliday, params);
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
    console.log("getHolidayData Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getWeeklyHolidayData = async (params) => {
  try {
    const res = await Api.POST(urlList.getWeeklyHoliday, params);
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
    console.log("getWeeklyHolidayData Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const setHolidayData = async (params) => {
  try {
    const res = await Api.POST(urlList.setHoliday, params);
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
    console.log("setHolidayData Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const setWeeklyHolidayData = async (params) => {
  try {
    const res = await Api.POST(urlList.setWeeklyHoliday, params);
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
    console.log("setWeeklyHolidayData Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const shareAdoption = async (params) => {
  try {
    const res = await Api.POST(urlList.shareAdoptionTemplate, params);
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
    console.log("shareAdoption Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};


export const shareProfileApi = async (params) => {
  try {
    const res = await Api.POST(urlList.shareProfile, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }

    if (res?.data?.data) {
      return res?.data?.data;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("shareProfileApi Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};


export const bookmarkApi = async (params) => {
  try {
    const res = await Api.POST(urlList.addBookmark, params);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }

    if (res?.data) {
      return res?.data;
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("shareProfileApi Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

