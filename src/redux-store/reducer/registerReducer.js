import {
  SERVICE_PROVIDER_DATA,
  SERVICE_PROVIDER_DATA_SUCCESS,
  SERVICE_PROVIDER_DATA_ERROR,
} from "../types";

const initialState = {
  registerData: {},
  isFetching: true,
};

export const registerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SERVICE_PROVIDER_DATA:
      return { ...state, registerData: payload };
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
    default:
      return state;
  }
};
