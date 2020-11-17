import { LIST_USERS, CREATE_USER, DELETE_USER, GET_ERRORS } from './types';
import axios from 'axios';

export const fetchUsers = () => {
    return (dispatch) => {
        return axios.get("/api/users/list")
        .then(response => {
            return response;
        })
        .then(response => {
            dispatch({
                type: LIST_USERS,
                payload: response // users
            });
        })
        .catch(error => {
            throw (error);
        });
    };
};

export const deleteUserById = (user) => dispatch => {
    axios.post("/api/users/delete", { user: user })
        .then(response => {
            dispatch({
                type: DELETE_USER,
                payload: response // user
            })
    })
    .catch(error => {
        console.log("Error deleting user:", error);
    });
}

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

        dispatch({
            type: GET_ERRORS,
            payload: error.response && error.response.data
        })
    });
};

export const editUser = (userData) => dispatch => {
    axios.post("/api/users/edit", { user: userData })
    .then(res => {
        console.log("Success. Edited user: ", res)
        fetchUsers();

    })
    .catch(error => {
        console.log('Error:', error);

        dispatch({
            type: GET_ERRORS,
            payload: error.response && error.response.data
        })
    });
};
