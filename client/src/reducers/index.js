import { combineReducers } from "redux";
import adminReducer from './adminReducer';
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  admin: adminReducer,
  auth: authReducer,
  errors: errorReducer
});
