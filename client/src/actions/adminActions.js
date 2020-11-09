import { LIST_USERS, CREATE_USER, EDIT_USER, DELETE_USER, GET_ERRORS } from './types';
import axios from 'axios';

export const fetchUsers = () => {
    return (dispatch) => {
        return axios.get("/api/users/list")
            .then(response => {
                return response;
            })
            .then(data => {
                dispatch(listUsers(data));
            })
            .catch(error => {
                throw (error);
            });
    };
};

export const listUsers = users => {
    return {
        type: LIST_USERS,
        payload: users
    }
};

export const createUser = (userData) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
        console.log("Success. Added user: ", res)
        dispatch({
            type: CREATE_USER, // 'admin/userAdded',
            payload: {
                user: res.data
            }
        })
    })
    .catch(error => {
        console.log('Error:', error, error.response && error.response.data);
        // console.log('response data', err.response.data);
        dispatch({
            type: GET_ERRORS,
            payload: error.response && error.response.data
        })
    });
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
