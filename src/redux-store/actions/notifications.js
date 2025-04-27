import Api from "../../api/Api";
import { urlList } from "../../constants/urlList";
import { NOTIFICATION_LIST } from "../types";

export const getNotificationList = (params) => {
  return async (dispatch) => {
    try {
      const response = await Api.POST(urlList.getNotificationList, params);
      if (response?.data?.status_code === 200) {
        dispatch({
          type: NOTIFICATION_LIST,
          payload: {
            list: response?.data?.data,
          },
        });
      }
    } catch (error) {}
  };
};
