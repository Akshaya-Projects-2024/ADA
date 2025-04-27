import { combineReducers } from "redux";
import { commonReducer, registerReducer } from "./reducer";
import { notificationReducer } from "./reducer/notificationReducer";

const appReducer = combineReducers({
  commonReducer: commonReducer,
  register: registerReducer,
  notification: notificationReducer
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
