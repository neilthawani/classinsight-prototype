import {
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET,
    CLEAR_VALID_STATE
} from '../actions/types';
import Parser from '../data/parser';

export default function datasetReducer(state, action) {
    switch (action.type) {
        case LIST_DATASETS:
            var activeIndex = parseInt(localStorage.getItem("activeDataRowIndex"), 10) || 0;

            if (activeIndex >= action.payload.length) {
                activeIndex = 0;
            }

            var dataParsers = action.payload.map((dataset, index) => {
                var parsedData = new Parser(dataset);
                return Object.assign(parsedData, { isActive: (index === activeIndex) });
            });

            return {
                ...state,
                datasets: action.payload,
                dataParsers: dataParsers,
                activeDataRowIndex: activeIndex,
                activeDataset: action.payload[activeIndex],
                activeParser: dataParsers[activeIndex]
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
            var activeIndex = action.payload;

            if (action.payload >= state.datasets.length) {
                activeIndex = 0;
            }

            return {
                ...state,
                activeDataset: state.datasets[activeIndex],
                activeParser: state.dataParsers[activeIndex],
                activeDataRowIndex: activeIndex
            }
        case CLEAR_VALID_STATE:
            return {
                ...state,
                isValid: null
            }
        default:
            return state || {};
    }
}
