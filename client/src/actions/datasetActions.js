import { GET_ERRORS, LIST_DATASETS, DELETE_DATASET, EDIT_DATASET, UPLOAD_DATASET, SHOW_DATASET } from './types';
import axios from 'axios';

export const editDataset = (dataset) => dispatch => {
    axios.post("/api/datasets/edit", dataset)
    .then(res => {
        console.log("Success. Edited dataset:", dataset);
        dispatch({
            type: EDIT_DATASET,
            payload: {
                dataset
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);

        // dispatch({
        //     type: GET_ERRORS,
        //     payload: error.response && error.response.data
        // })
    });
};

export const showDataset = (datasetId) => {
    return (dispatch) => {
        // console.log("userId is", userId);
        return axios.get("/api/datasets/show", { params: { id: datasetId }})
        .then(response => {
            // console.log("response", response);
            // return response && response.data.user;
            dispatch({
                type: SHOW_DATASET,
                payload: response && response.data.dataset
            })
        })
        .catch(error => {
            console.error(error);
            return error;
        });
    };
};

export const listDatasets = () => {
    return (dispatch) => {
        return axios.get("/api/datasets/list")
        .then(response => {
            // console.log("response", response);
            return response && response.data;
        })
        .then(ret => {
            // console.log("ret", ret);
            dispatch({
                type: LIST_DATASETS,
                payload: ret // datasets
            });
        })
        .catch(error => {
            throw (error);
        });
    };
};

export const deleteDataset = (dataset) => dispatch => {
    axios.post("/api/datasets/edit", { dataset: { ...dataset, isDeleted: true } })
        .then(response => {
            dispatch({
                type: DELETE_DATASET,
                payload: response // dataset
            })
    })
    .catch(error => {
        console.log("Error deleting dataset:", error);
    });
}

export const uploadDataset = (dataset) => dispatch => {
  axios
    .post("/api/datasets/upload", dataset)
    .then(res => {
        console.log("Success. Added dataset:", res)
        dispatch({
            type: UPLOAD_DATASET,
            payload: {
                dataset: res.data
            }
        })
    })
    .catch(error => {
        // console.log("error", error);
        // debugger;
        console.error(error);
        console.error(error.response && error.response.data);

        dispatch({
            type: GET_ERRORS,
            payload: //{
              // errors:
              error.response && error.response.data
            // }
        })
    });
};
