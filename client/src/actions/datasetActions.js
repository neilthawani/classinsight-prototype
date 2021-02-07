import {
    GET_ERRORS,
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET,
    CLEAR_VALID_STATE,
    UPLOAD_CSV_DATA,
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
        dispatch({
            type: SHOW_DATASET,
            payload: datasetIndex
        });
    };
};

export const clearValidState = () => {
    return (dispatch) => {
        dispatch({
            type: CLEAR_VALID_STATE,
            payload: false
        });

        dispatch({
            type: GET_ERRORS,
            payload: {}
        });
    }
}

export const listDatasets = (userId) => {
    return (dispatch) => {
        return axios.get("/api/datasets/list", {
                params: {
                    userId: userId
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
            });
        })
        .catch(error => {
            console.error(error);
            console.error(error.response && error.response.data);

            dispatch({
                type: GET_ERRORS,
                payload: error.response && error.response.data
            });
        });
};

export const uploadCsvData = (data) => dispatch => {
    axios
    .post("/api/datasets/upload-csv", data)
    .then(res => {
        console.log("Success. Uploaded data:", res);

        dispatch({
            type: UPLOAD_CSV_DATA,
            payload: {
                dataset: res.data
            }
        });
    })
    .catch(error => {
        console.error(error);
        console.error(error.response && error.response.data);

        dispatch({
            type: GET_ERRORS,
            payload: error.response && error.response.data
        });
    });
};
