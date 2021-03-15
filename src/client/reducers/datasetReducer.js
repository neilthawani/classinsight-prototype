import {
    LIST_DATASETS,
    DELETE_DATASET,
    EDIT_DATASET,
    UPLOAD_DATASET,
    SHOW_DATASET,
    CLEAR_VALID_STATE
} from '../actions/types';
import Parser from '../data/parser';
import ParserCollection from '../data/parser-collection';

export default function datasetReducer(state, action) {
    switch (action.type) {
        case LIST_DATASETS:
            var activeIndex = parseInt(localStorage.getItem("activeDataRowIndex"), 10) || 0;

            if (activeIndex >= action.payload.length) {
                activeIndex = 0;
            }

            // sort by date, descending
            var sortedPayload = action.payload.sort((a, b) => {
                var splitA = a.classDate.split("-");
                var splitB = b.classDate.split("-");

                return splitA[0] - splitB[0] || splitA[1] - splitB[1] || splitA[2] - splitB[2];
            }).reverse();

            var dataParsers = sortedPayload.map((dataset, index) => {
                var parsedData = new Parser(dataset);
                return Object.assign(parsedData, { isActive: (index === activeIndex) });
            });

            var parserCollection = new ParserCollection(dataParsers);

            // console.log("dataParsers", dataParsers);
            return {
                ...state,
                datasets: sortedPayload,
                dataParsers: dataParsers,
                activeDataRowIndex: activeIndex,
                activeDataset: sortedPayload[activeIndex],
                activeParser: dataParsers[activeIndex],
                parserCollection: parserCollection
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
                activeDataset: state.datasets && state.datasets[activeIndex],
                activeParser: state.dataParsers && state.dataParsers[activeIndex],
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
