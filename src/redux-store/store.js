import { applyMiddleware, compose } from "redux";
import { legacy_createStore as createStore } from "redux";
import { thunk } from "redux-thunk";

import rootReducer from "./rootReducer";

const configureStore = () => {
  let store = createStore(rootReducer, compose(applyMiddleware(thunk)));
  return store;
};

export default configureStore;
