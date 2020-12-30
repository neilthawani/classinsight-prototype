import {
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET,
    CLEAR_VALID_STATE
    // SET_ACTIVE_INDEX
} from '../actions/types';
import Parser from '../data/parser';

export default function datasetReducer(state, action) {
    // console.log("datasetReducer", action);
    switch (action.type) {
        case LIST_DATASETS:
            var activeIndex = parseInt(localStorage.getItem("activeDataRowIndex"), 10) || 0;
            // console.log("LIST_DATASETS activeIndex", activeIndex, "action.payload.length", action.payload.length);
            // console.log("LIST_DATASETS types", typeof activeIndex, typeof action.payload.length);
            // debugger;
            if (activeIndex >= action.payload.length) {
                // console.log("activeIndex!!!", activeIndex);
                activeIndex = 0;
            }

            // console.log("action.payload", action.payload);
            var dataParsers = action.payload.map((dataset, index) => {
                var parsedData = new Parser(dataset);
                return Object.assign(parsedData, { isActive: (index === activeIndex) });
            });

            return {
                ...state,
                datasets: action.payload,
                dataParsers: dataParsers,
                activeDataRowIndex: activeIndex,
                activeDataset: action.payload[activeIndex],//state.datasets[action.payload],
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
            console.log("SHOW_DATASET", action.payload, typeof action.payload)
            if (action.payload >= state.datasets.length) {
                activeIndex = 0;
            }
            // return {
                // localStorage.setItem("activeParser", state.dataParsers[action.payload]);
                // console.log("state", state);
            return {
                ...state,
                activeDataset: state.datasets[activeIndex],
                activeParser: state.dataParsers[activeIndex],
                activeDataRowIndex: activeIndex
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
        case CLEAR_VALID_STATE:
            return {
                ...state,
                isValid: null
            }
        default:
            return state || {};
    }
}
