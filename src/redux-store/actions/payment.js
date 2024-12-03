import authApi from "../../auth/authApi";
import { urlList } from "../../constants/urlList";

export const getSubscriptionPlan = async (params) => {
  try {
    const res = await authApi({
      method: "post",
      url: urlList.subscriptionplan,
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
    console.log("payment ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getSubscription = async (params) => {
  try {
    const res = await authApi({
      method: "post",
      url: urlList.subscription,
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
    console.log("payment ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};