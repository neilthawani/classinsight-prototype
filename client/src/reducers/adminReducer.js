import { LIST_USERS, ADD_USER_TO_USERS_LIST, CREATE_USER, DELETE_USER } from '../actions/types';

var validateNewUser = function() {}
var deleteUserById = function() {}

export default function(state = [], action) {
    // var users = [];

    switch (action.type) {
        case LIST_USERS:
            console.log("LIST_USERS", action.payload.data);
            var users = {
                ...state,
                users: action.payload.data
            };
            // console.log("LIST_USERS users", users);
            // return [...action.payload];
            // debugger;
            // return action.users;
            return users;
        case CREATE_USER:
            var isValid = validateNewUser(action.data);
            if (isValid) {
                var users = [...state, action.data];
            } else {

            }
            return users;
        case DELETE_USER:
            var users = deleteUserById(state, action.id);
            return users;
        case ADD_USER_TO_USERS_LIST:
            return [...state, action.payload];

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
        default:
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
