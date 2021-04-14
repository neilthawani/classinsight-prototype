import {
    GET_ERRORS,
    LIST_USERS,
    CLEAR_IS_VALID_USER,
    EDIT_USER,
    CREATE_USER,
    DELETE_USER,
    SHOW_USER,
    RESET_PASSWORD
} from '../actions/types';

export default function adminReducer(state, action) {
    switch (action.type) {
        case CLEAR_IS_VALID_USER:
            return {
                ...state,
                isValidUser: null
            }
        case RESET_PASSWORD:
            return {
                ...state,
                passwordResetSuccessful: action.payload.passwordResetSuccessful
            };
        case LIST_USERS:
            return {
                ...state,
                users: action.payload.data
            };
        case EDIT_USER:
            // console.log("action.payload", action.payload)
            return {
                ...state,
                userEdited: action.payload.userEdited
            }
        case CREATE_USER:
            // console.log('CREATE_USER action.payload.user', action.payload.user);
            return {
                isValidUser: true,
                users: [action.payload.user, ...state.users]
            };
        case DELETE_USER:
            // console.log('DELETE_USER', state.users);
            return {
                users:
                    state.users.filter(user => user && user._id !== action.payload.data.user._id)
            };
        case GET_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        case SHOW_USER:
            // console.log('show', action.payload);
            return {
                ...state,
                user: action.payload
            }
            default:
                return {
                    ...state
                };
    }
}
