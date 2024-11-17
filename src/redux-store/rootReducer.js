import { combineReducers } from "redux";
import { commonReducer, registerReducer } from "./reducer";

const appReducer = combineReducers({
  commonReducer: commonReducer,
  register: registerReducer,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
