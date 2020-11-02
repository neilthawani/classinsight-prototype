// import { CREATE_USER, DELETE_USER } from '../actions/types';
//
// export default function(state = initialState, action) {
//     switch (action.type) {
//         case CREATE_USER:
//             isValid = validateNewUser(action.data);
//             if (isValid) {
//                 users = [...state, action.data];
//             } else {
//
//             }
//             return users;
//         case DELETE_USER:
//             users = deleteUserById(state, action.id);
//             return users;
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
//         default:
//             return state;
//     }
// }

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
// export const listUsers = users => ({
//     type: LIST_USERS,
//     payload: {
//         users
//     }
// })
