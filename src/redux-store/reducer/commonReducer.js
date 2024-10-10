import { PROFILE_DATA} from '../types';

const initialState = {
  userData: null,

};

export const CommonReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case PROFILE_DATA:
      return {
        ...state,
        userData: payload,
      };
  
    default:
      return state;
  }
};
