import { combineReducers } from "redux";
import { CommonReducer } from "./reducer";
import { registerReducer } from "./reducer";

const appReducer = combineReducers({
  commonReducer: CommonReducer,
  register: registerReducer,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
