import { GET_ERRORS, LIST_USERS, EDIT_USER, CREATE_USER, DELETE_USER, SHOW_USER, RESET_PASSWORD } from '../actions/types';

export default function(state, action) {
    switch (action.type) {
        case RESET_PASSWORD:
            // debugger;
            var ret = {
                ...state,
                passwordResetSuccessful: action.payload.passwordResetSuccessful
            };
            debugger;
            return ret;
        case LIST_USERS:
            var users = {
                ...state,
                users: action.payload.data
            };

            return users;
        case EDIT_USER:
            return { users:
                state.users.map((user) => {
                    if (user._id === action.payload.userData.user._id) {
                        return action.payload.userData.user;
                    }
                    return user;
                })
            };
        case CREATE_USER:
            return {
                users: (state.users && state.users.concat(action.payload.user)) || action.payload.user
            };
        case DELETE_USER:
            return { users:
                state.users.filter(user => user._id !== action.payload.data.user._id)
            };
        case GET_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        case SHOW_USER:
            // console.log("action", action.payload);
            return {
                ...state,
                user: action.payload
            }
        default:
            return { ...state };
    }
}
