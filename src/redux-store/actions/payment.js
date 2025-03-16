import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";

export const getSubscriptionPlan = async (params) => {
  try {
    const res = await Api.POST(urlList.subscriptionplan, params);
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
    const res = await Api.POST(urlList.subscription, params);
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
    console.log("getSubscription Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const acknowledgeSubscription = async (obj) => {
  try {
    const res = await Api.POST(urlList.acknowledgeSubscription, obj);
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
    console.log("acknowledgeSubscription Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getSubscriptionDetailsApi = async (obj) => {
  try {
    const res = await Api.POST(urlList.paymentSubscriptionList, obj);
    if (!res || res?.data?.error || res?.data?.errorCode) {
      throw new Error(
        res?.data?.message || res?.data?.error || "Something went wrong!"
      );
    }
    if (res?.data?.data?.length) {
      return res?.data?.data;
    } else {
      return [];
    }
    throw new Error("Something went wrong!");
  } catch (error) {
    console.log("acknowledgeSubscription Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getInvoiceApi = async (obj) => {
  try {
    const res = await Api.POST(urlList.paymentInvoice, obj);
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
    console.log("acknowledgeSubscription Error! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};
