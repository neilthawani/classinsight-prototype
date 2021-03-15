import {
    SET_CURRENT_USER,
    USER_LOADING
} from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            // console.log("SET_CURRENT_USER", action);
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            // console.log("USER_LOADING", action);
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
