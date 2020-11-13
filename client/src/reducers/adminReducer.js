import { GET_ERRORS, LIST_USERS, ADD_USER_TO_USERS_LIST, CREATE_USER, DELETE_USER } from '../actions/types';
import removeArrayValue from '../utils/removeArrayValue';
// var initialState = {
//     name: "",
//     email: "",
//     password: "",
//     password2: "",
//     errors: {}
// };

// var validateNewUser = function() {}
// var deleteUserById = function() {}

export default function(state, action) {
    switch (action.type) {
        case LIST_USERS:
            console.log("LIST_USERS", action.payload.data);
            return {
                ...state,
                users: action.payload.data
            };
        case CREATE_USER:
            // debugger;
            console.log("CREATE_USER")
            // var isValid = validateNewUser(action.payload),
                // users = null;
            // if (isValid) {
            // debugger;
            state.users.push(action.payload);
            var users = {
                ...state
            };
            // }
            // debugger;
            return users;
        case DELETE_USER:
            // debugger;
            // console.log("DELETE_USER", action.payload.data.user, state.users);
            // debugger;
            var users = state.users.filter(user => user._id !== action.payload.data.user._id);
            // var users = removeArrayValue(action.payload.data.user, state.users);
            // console.log("users", users);
            return { users: users };
            // debugger;
            // console.log("users", users);
            // return users;
        case ADD_USER_TO_USERS_LIST:
            return [...state, action.payload];
        case GET_ERRORS:
            return {
                ...state,
                errors: action.payload
            }
        default:
            // console.log("action", action);
            return { ...state };
    }
}

// import { LIST_USERS } from '../actions/types';
//
// export default function adminReducer(state = [], action) {
//     switch(action.type) {
//         case LIST_USERS:
//         default:
//             return {
//                 ...state,
//                 value: state.filter((item) => !item.isAdmin)
//             }
//     }
// }

// import { SET_CURRENT_USER, USER_LOADING } from "../actions/types";
//
// const isEmpty = require("is-empty");
//
// const initialState = {
//   isAuthenticated: false,
//   user: {},
//   loading: false
// };
//
//



// case SET_CURRENT_USER:
//     return {
//         ...state,
//         isAuthenticated: !isEmpty(action.payload),
//         user: action.payload
//     };
// case USER_LOADING:
//     return {
//         ...state,
//         loading: true
//     };
