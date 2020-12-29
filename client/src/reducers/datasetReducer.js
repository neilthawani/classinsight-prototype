import {
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET,
    // SET_ACTIVE_INDEX
} from '../actions/types';
import Parser from '../data/parser';

export default function datasetReducer(state, action) {
    switch (action.type) {
        case LIST_DATASETS:
            // console.log("action.payload", action.payload);
            var dataParsers = action.payload.map((dataset, index) => {
                var parsedData = new Parser(dataset);
                return Object.assign(parsedData, { isActive: (index === 0) });
            });

            return {
                ...state,
                datasets: action.payload,
                dataParsers: dataParsers,
                activeDataset: action.payload[0],//state.datasets[action.payload],
                activeParser: dataParsers[0]
            };
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
            // return {
                // localStorage.setItem("activeParser", state.dataParsers[action.payload]);

                return {
                    ...state,
                    activeDataset: state.datasets[action.payload],
                    activeParser: state.dataParsers[action.payload]
                }
                // for (var i = 0; i < state.datasets.length; i++) {
                //     if (i === action.payload) {
                //
                //     }
                // }
                // return state.datasets.reduce((prev, dataset, index, array) => {
                //     if (index === action.payload) {
                //         prev.push(dataset);
                //         return prev;
                //     }
                // }, []);
                // dataset: action.payload
            // }
        default:
            return state || {};
    }
}
