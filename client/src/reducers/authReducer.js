import {
    SET_CURRENT_USER,
    USER_LOADING
    // ,
    // GOOGLE_OAUTH2
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
            // console.log("SET_CURRENT_USER", action.payload);
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        // case GOOGLE_OAUTH2:
        //     console.log("authReducer GOOGLE_OAUTH2", action.googleResponse);
        //     // https://medium.com/swlh/react-js-authentication-with-google-oauth2-using-redux-295c51868afb
        //     // should be accessToken
        //     return action.googleResponse;//action.googleResponse;
        default:
            return state;
    }
}
