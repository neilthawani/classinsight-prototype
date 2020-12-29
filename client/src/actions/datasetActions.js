import {
    GET_ERRORS,
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET
} from './types';
import axios from 'axios';

export const editDataset = (dataset) => dispatch => {
    axios.post("/api/datasets/edit", dataset)
        .then(res => {
            console.log("Success. Edited dataset:", dataset.dataset);
            dispatch({
                type: EDIT_DATASET,
                payload: dataset
            });
        })
        .catch(error => {
            console.error(error);

            // dispatch({
            //     type: GET_ERRORS,
            //     payload: error.response && error.response.data
            // })
        });
};

export const deleteDatasetById = (dataset) => dispatch => {
    axios.post("/api/datasets/edit", {
            dataset: {
                ...dataset,
                isDeleted: true
            }
        })
        .then(response => {
            // debugger;
            dispatch({
                type: DELETE_DATASET,
                payload: response && response.data // dataset
            })
        })
        .catch(error => {
            console.log("Error deleting dataset:", error);
        });
}

export const showDataset = (datasetIndex) => {
    return (dispatch) => {
        // return axios.get("/api/datasets/show", {
        //         params: {
        //             id: datasetId
        //         }
        //     })
        //     .then(response => {
                dispatch({
                    type: SHOW_DATASET,
                    payload: datasetIndex//response && response.data.dataset
                })
            // })
            // .catch(error => {
            //     console.error(error);
            //     return error;
            // });
    };
};

export const listDatasets = (userId) => {
    return (dispatch) => {
        return axios.get("/api/datasets/list", {
                params: {
                    user_id: userId
                }
            })
            .then(response => {
                return response && response.data;
            })
            .then(ret => {
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

export const uploadDataset = (dataset) => dispatch => {
    axios
        .post("/api/datasets/upload", dataset)
        .then(res => {
            console.log("Success. Added dataset:", res);

            dispatch({
                type: UPLOAD_DATASET,
                payload: {
                    dataset: res.data
                }
            })
        })
        .catch(error => {
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
