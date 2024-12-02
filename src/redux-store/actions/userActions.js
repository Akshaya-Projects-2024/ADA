import { GUEST_USER, PROFILE_LOGGED_IN_MODULE } from "../types";

export const dispatchLoggedInModule = (loggedInModule) => {
  return (dispatch) => {
    dispatch({ type: PROFILE_LOGGED_IN_MODULE, payload: loggedInModule });
  };
};

export const dispathGuestUser = (flag) => {
  return (dispatch) => {
    dispatch({ type: GUEST_USER, payload: flag });
  };
};
