import { combineReducers } from "redux";
import adminReducer from './adminReducer';
import datasetReducer from './datasetReducer';
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    admin: adminReducer,
    dataset: datasetReducer,
    auth: authReducer,
    errors: errorReducer
});
