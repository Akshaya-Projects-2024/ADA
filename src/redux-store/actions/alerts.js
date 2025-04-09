import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";
import { showToast } from "../../utils/utils";

export const AddLostPetAlert = async (obj) => {
  try {
    const res = await Api.POST(urlList.lostPetAlert, obj);
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
    showToast("error", error.message || "An alert is already created for this pet")
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};

export const getAlertListApi = async (obj) => {
  try {
    const res = await Api.POST(urlList.getAlert, obj);
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
    console.log("checkLogin getAlertListApi! ", error);
    throw new Error(error?.message || error || "Opps! Something went wrong!");
  }
};