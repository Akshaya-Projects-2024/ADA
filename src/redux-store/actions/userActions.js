import { PROFILE_LOGGED_IN_MODULE } from "../types";

export const dispatchLoggedInModule = (loggedInModule) => {
  return (dispatch) => {
    dispatch({ type: PROFILE_LOGGED_IN_MODULE, payload: loggedInModule });
  };
};
