import { NOTIFICATION_LIST } from "../types";

const initialState = {
  notificationList: null,
};

export const notificationReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case NOTIFICATION_LIST:
      return {
        ...state,
        notificationList: {
          ...payload.list,
          unreadcnt: payload.list.today
            ? payload.list.today?.filter((x) => !x.isread)?.length
            : 0,
        },
      };
    default:
      return state;
  }
};
