import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";

export const getAllReviews = async (params) => {
  try {
    const res = await Api.POST(urlList.globalReviews, params);
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
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};


export const replyReviewApi = async (params) => {
    try {
      const res = await Api.POST(urlList.replyReview, params);
      if (!res || res?.data?.error || res?.data?.errorCode) {
        throw new Error(
          res?.data?.message || res?.data?.error || "Something went wrong!"
        );
      }
      if (res?.data?.data) {
        return res?.data;
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      throw new Error(error?.message || error || "Opps! Something went wrong!");
    }
  };


export const reviewGiven = async (params) => {
    try {
      const res = await Api.POST(urlList.reviewGiven, params);
      if (!res || res?.data?.error || res?.data?.errorCode) {
        throw new Error(
          res?.data?.message || res?.data?.error || "Something went wrong!"
        );
      }
      if (res?.data?.data) {
        return res?.data;
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      throw new Error(error?.message || error || "Opps! Something went wrong!");
    }
  };


  export const addReview = async (params) => {
    try {
      const res = await Api.POST(urlList.addReview, params);
      if (!res || res?.data?.error || res?.data?.errorCode) {
        throw new Error(
          res?.data?.message || res?.data?.error || "Something went wrong!"
        );
      }
      if (res?.data?.data) {
        return res?.data;
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      throw new Error(error?.message || error || "Opps! Something went wrong!");
    }
  };