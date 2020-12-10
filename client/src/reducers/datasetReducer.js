import { LIST_DATASETS, DELETE_DATASET, EDIT_DATASET, UPLOAD_DATASET, SHOW_DATASET } from '../actions/types';

export default function(state, action) {
    switch (action.type) {
        case LIST_DATASETS:
            return {
                ...state,
                datasets: action.payload
            }
        case EDIT_DATASET:
            return {
                datasets:
                    state.datasets.map((dataset) => {
                        if (dataset._id === action.payload.dataset._id) {
                            return action.payload.dataset;
                        }

                        return dataset;
                    })
            };
        case UPLOAD_DATASET:
            return {
                datasets: [action.payload.dataset, ...state.datasets],
                isValid: true
            };
        case DELETE_DATASET:
            return {
                datasets:
                    state.datasets.filter(dataset => dataset._id !== action.payload.dataset._id)
            };
        case SHOW_DATASET:
            return {
                ...state,
                dataset: action.payload
            }
        default:
            return state || {};
    }
}
