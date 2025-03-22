import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";

export const getAdoptionCategory = async (obj) => {
  try {
    const res = await Api.POST(urlList.getPetCategory, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      if (res?.data?.data?.length) {
        let data = res?.data?.data;
        return data;
      } else {
        return [];
      }
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("checkLogin Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getContactDetails = async () => {
  try {
    const res = await Api.GET(urlList.contactPage);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      if (res?.data?.data) {
        let data = res?.data?.data;
        return data;
      } else {
        return [];
      }
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("checkLogin Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const WriteToUsApi = async (obj) => {
  try {
    const res = await Api.POST(urlList.writeUs, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      if (res?.data?.status_code == 200) {
        let data = res?.data;
        return data;
      } else {
        return [];
      }
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("checkLogin Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const feedbackApi = async (obj) => {
  try {
    const res = await Api.POST(urlList.feedback, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res) {
      if (res?.data?.status_code == 200) {
        let data = res?.data;
        return data;
      } else {
        return [];
      }
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("checkLogin Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};


export const getAppointmentHistoryApi = async (params) => {
  try {
    const res = await Api.POST(urlList.getAppointmentHistory, params);
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
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

