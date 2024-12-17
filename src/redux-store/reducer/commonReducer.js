import { PROFILE_DATA } from "../types";

const initialState = {
  logindetails: {},
  parentProfie: {},
  providerProfile: {},
  profileData: {},
};

export const commonReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PROFILE_DATA:
      return {
        ...state,
        profileData: payload?.logindetails?.isprovider !== 0 ?  payload?.providerProfile : payload?.parentProfie, 
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
