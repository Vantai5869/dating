import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../components/Login/authSlice";

const authConfigReducer = {
  key: "auth",
  storage,
  whitelist: ["currentUser"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfigReducer, authReducer),
});

export default rootReducer;
