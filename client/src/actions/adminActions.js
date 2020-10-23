import axios from "axios";

import { GET_ERRORS, LIST_USERS } from './types';

export const listUsers = () => dispatch => {
    axios.get("/api/users/list")
        .then(res => {
            console.log("adminActions res", res);
            dispatch({
                type: LIST_USERS,
                payload: res && res.data,
            });

            // ctx.setState({
            //     users: res && res.data
            // });
        }).catch(err => {
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
          });
      });
}
