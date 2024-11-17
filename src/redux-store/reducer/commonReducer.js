import { PROFILE_DATA } from "../types";

const initialState = {
  logindetails: {},
  parentProfie: {},
  providerProfile: {},
};

export const commonReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PROFILE_DATA:
      return {
        ...state,
        logindetails: payload?.logindetails,
        ...(payload?.parentProfie
          ? { parentProfie: payload?.parentProfie }
          : {}),
        ...(payload?.providerProfile
          ? { providerProfile: payload?.providerProfile }
          : {}),
      };
    default:
      return state;
  }
};
