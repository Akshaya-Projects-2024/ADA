import {
  PROFILE_DATA,
  REFRESH_ACTIVITY_DATA,
  REFRESH_USER_DATA,
} from "../types";

const initialState = {
  logindetails: {},
  parentProfie: {},
  providerProfile: {},
  profileData: {},
  refreshUserData: false,
  refreshActivityData: false,
};

export const commonReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PROFILE_DATA:
      return {
        ...state,
        profileData:
          payload?.logindetails?.isprovider !== 0
            ? payload?.providerProfile
            : payload?.parentProfie,
        logindetails: payload?.logindetails,
        ...(payload?.parentProfie
          ? { parentProfie: payload?.parentProfie }
          : {}),
        ...(payload?.providerProfile
          ? { providerProfile: payload?.providerProfile }
          : {}),
      };
    case REFRESH_USER_DATA:
      return {
        ...state,
        refreshUserData: !state.refreshUserData,
      };
    case REFRESH_ACTIVITY_DATA:
      return {
        ...state,
        refreshActivityData: !state.refreshActivityData,
      };
    default:
      return state;
  }
};
