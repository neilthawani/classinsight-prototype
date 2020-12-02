// import { GET_ERRORS, LIST_USERS, EDIT_USER, CREATE_USER, DELETE_USER, SHOW_USER } from '../actions/types';
import { LIST_DATASETS, DELETE_DATASET, EDIT_DATASET, UPLOAD_DATASET, SHOW_DATASET } from './types';

export default function(state, action) {
    switch (action.type) {
        case LIST_DATASETS:
            var datasets = {
                ...state,
                datasets: action.payload.data
            };

            return datasets;
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
            return {
                datasets: state.datasets.concat(action.payload.dataset)
            };
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
            return { ...state };
    }
}
