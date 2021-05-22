import {
    GET_ERRORS,
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET,
    CLEAR_VALID_STATE,
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


// Angela suggested iterating over each utterance
// Instead of adding an utterance collection, add each utterance in batches to the same collection
// Do listing by querying utterances and appending them to datasets.

export const listDatasets = (userId) => {
    return (dispatch) => {
        return axios.get("/api/datasets/list", {
                params: {
                    userId: userId
                }
            })
            .then(response => {
                // console.log('response', response);
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
    const utterances = dataset['utterances'];
    const batchedUtterances = [];
    const batchSize = 200;
    utterances.forEach((item, index) => {
        if (index % batchSize === 0) {
            batchedUtterances.push(utterances.slice(index, index + batchSize));
        }
    });
    delete dataset['utterances'];

    axios.post("/api/datasets/upload", dataset)
    .then(res => {
        var newDataset = { ...res.data[0], utterances: batchedUtterances };
        console.log("Success. Added dataset:", newDataset);

        // utterances.forEach((utterance) => {
        //     // console.log('utterance', utterance);
        //     // debugger;
        //     axios.post("/api/datasets/upload-utterances").then((res) => {
        //         console.log("Pushing utterance", utterance, "to dataset", dataset);
        //         newDataset.utterances.push(res.data[0]);
        //     }).catch(error => {
        //         console.log("Error saving utterance:", error);
        //     });
        // });

        dispatch({
            type: UPLOAD_DATASET,
            payload: {
                dataset: newDataset
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
