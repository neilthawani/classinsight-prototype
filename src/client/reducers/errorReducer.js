import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function errorReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
          // console.log('GET_ERRORS', action);
            if (typeof action.payload !== "object") {
                return { errors: action.payload };
            }

            return action.payload;
        default:
            return state;
    }
}
