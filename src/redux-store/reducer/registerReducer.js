import {
  SERVICE_PROVIDER_DATA,
  SERVICE_PROVIDER_DATA_SUCCESS,
  SERVICE_PROVIDER_DATA_ERROR,
  SERVICE_PROVIDER_ROLE,
  SERVICE_PROVIDER_ROLE_SUCCESS,
  SERVICE_PROVIDER_ROLE_ERROR,
  PROFILE_LOGGED_IN_MODULE,
  GUEST_USER,
} from "../types";

const initialState = {
  registerData: {},
  isFetching: true,
  serviceProviderRoleData: [],
  loggedInModule: "",
  guestUser: false,
};

export const registerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SERVICE_PROVIDER_DATA:
      return { ...state, registerData: payload };
    case PROFILE_LOGGED_IN_MODULE:
      return { ...state, loggedInModule: payload };
    case GUEST_USER:
      return { ...state, guestUser: payload };
    case SERVICE_PROVIDER_DATA_SUCCESS:
      return {
        ...state,
        registerData: payload,
        isFetching: false,
      };
    case SERVICE_PROVIDER_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        registerData: [],
      };
    case SERVICE_PROVIDER_ROLE:
      return { ...state, serviceProviderRoleData: payload };
    case SERVICE_PROVIDER_ROLE_SUCCESS:
      return {
        ...state,
        serviceProviderRoleData: payload,
        isFetching: false,
      };
    case SERVICE_PROVIDER_ROLE_ERROR:
      return {
        ...state,
        isFetching: false,
        serviceProviderRoleData: [],
      };
    default:
      return state;
  }
};
