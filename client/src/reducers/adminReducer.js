import { GET_ERRORS, LIST_USERS, ADD_USER_TO_USERS_LIST, CREATE_USER, DELETE_USER } from '../actions/types';

// var initialState = {
//     name: "",
//     email: "",
//     password: "",
//     password2: "",
//     errors: {}
// };

var validateNewUser = function() {}
var deleteUserById = function() {}

export default function(state, action) {
    switch (action.type) {
        case LIST_USERS:
            return {
                ...state,
                users: action.payload.data
            };
        case CREATE_USER:
            console.log("CREATE_USER")
            var isValid = validateNewUser(action.data),
                users = null;
            if (isValid) {
                users = [...state, action.data];
            }
            return users;
        case DELETE_USER:
            console.log("DELETE_USER in adminReducer");
            return deleteUserById(state, action.id);
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
