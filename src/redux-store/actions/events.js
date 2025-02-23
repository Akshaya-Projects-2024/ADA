import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";

export const createEvent = async (params) => {
  try {
    const res = await Api.POST(urlList.registerEvents, params);
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

export const getAllEventsApi = async (params) => {
  try {
    const res = await Api.POST(urlList.getAllEvents, params);
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
