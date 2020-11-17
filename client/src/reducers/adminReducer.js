import { GET_ERRORS, LIST_USERS, CREATE_USER, DELETE_USER } from '../actions/types';

export default function(state, action) {
    switch (action.type) {
        case LIST_USERS:
            return {
                ...state,
                users: action.payload.data
            };
        case CREATE_USER:
            return {
                users: state.users.concat(action.payload.user)
            };
        case DELETE_USER:
            var users = state.users.filter(user => user._id !== action.payload.data.user._id);
            return { users: users };
        case GET_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        default:
            return { ...state };
    }
}
