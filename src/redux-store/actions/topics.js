import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";

export const createTopic = async (params) => {
  try {
    const res = await Api.POST(urlList.createTopic, params);
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

export const getMyTopics = async (params) => {
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
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};
