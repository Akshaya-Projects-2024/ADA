import authApi from "../../auth/authApi";
import { urlList } from "../../constants/urlList";

export const createEvent = async (params) => {
  try {
    const res = await authApi({
      method: "post",
      url: urlList.registerEvents,
      data: params,
    });
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
