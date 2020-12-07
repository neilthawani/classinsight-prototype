// import { GET_ERRORS, LIST_USERS, EDIT_USER, CREATE_USER, DELETE_USER, SHOW_USER } from '../actions/types';
import { GET_ERRORS, LIST_DATASETS, DELETE_DATASET, EDIT_DATASET, UPLOAD_DATASET, SHOW_DATASET } from '../actions/types';

export default function(state, action) {
    switch (action.type) {
        case LIST_DATASETS:
            // console.log("LIST_DATSETS state", state);
            // console.log("LIST_DATSETS action", action.payload);
            // var datasets = {
                // ...state,
                // ...[action.payload][0]
                // action.payload
            // };

            // console.log("LIST_DATASETS datasetsReducer", datasets);

            return {
                ...state,
                datasets: action.payload
            }
            // datasets;
        case EDIT_DATASET:
            return { datasets:
                state.datasets.map((dataset) => {
                    if (dataset._id === action.payload.dataset.id) { // might not be correct
                        return action.payload.dataset;
                    }
                    return dataset;
                })
            };
        case UPLOAD_DATASET:
            // console.log("state", state);
            // console.log("action.payload", action.payload);
            // debugger;
            // datasets: action.payload.dataset
            // var ret = {
                // ...state,
                // datasets:
                // return (state.datasets && state.datasets.concat(action.payload.dataset)) || [action.payload.dataset];
                return {
                    datasets: (state && state.datasets && state.datasets.push(action.payload.dataset)) || [action.payload.dataset],
                    uploadedDataset: action.payload.dataset,
                    isValid: true
                }
            // };
            // console.log("ret", ret);
            // return ret;
        case DELETE_DATASET:
            return { datasets:
                state.datasets.filter(dataset => dataset._id !== action.payload.data.dataset._id)
            };
        // case GET_ERRORS:
        //     return {
        //         ...state,
        //         errors: action.payload
        //     }
        case SHOW_DATASET:
            // console.log("action", action.payload);
            return {
                ...state,
                dataset: action.payload
            }
        default:
            // console.log("state || []", state || []);
            return state || {};
    }
}
