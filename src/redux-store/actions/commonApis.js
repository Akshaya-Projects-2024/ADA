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
