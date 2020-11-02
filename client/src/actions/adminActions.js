import { LIST_USERS, CREATE_USER, EDIT_USER, DELETE_USER } from './types';

export const addUser = userObj => {
    return {
        type: CREATE_USER, // 'admin/userAdded',
        payload: {
            user: userObj
        }
    }
};

export const deleteUser = userId => {
    return {
        type: DELETE_USER,
        payload: {
            userId
        }
    }
};

export const editUser = userId => {
    return {
        type: EDIT_USER,
        userId
    }
};

export const listUsers = users => {
    return {
        type: LIST_USERS,
        users
    }
};

// import axios from "axios";
//
// import { GET_ERRORS, LIST_USERS } from './types';
//
// export const listUsers = () => dispatch => {
//     axios.get("/api/users/list")
//         .then(res => {
//             console.log("adminActions res", res);
//             dispatch({
//                 type: LIST_USERS,
//                 payload: res && res.data
//             })
//     });
// };

// export const listUsers = () => dispatch => {
//     axios.get("/api/users/list")
//         .then(res => {
//             console.log("adminActions res", res);
//             dispatch({
//                 type: LIST_USERS,
//                 payload: res && res.data,
//             });
//
//             // ctx.setState({
//             //     users: res && res.data
//             // });
//         }).catch(err => {
//             dispatch({
//               type: GET_ERRORS,
//               payload: err.response.data
//           });
//       });
// }

// action creator


// export const LIST_USERS = "LIST_USERS";
// export const CREATE_USER = "CREATE_USER";
// export const EDIT_USER = "EDIT_USER";
// export const DELETE_USER = "DELETE_USER";
