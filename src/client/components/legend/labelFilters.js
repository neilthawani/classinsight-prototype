const changeActiveFilters = function(activeFilters, label) {
    var index = getLabelIndex(activeFilters, label);

    if (index > -1) {
        activeFilters.splice(index, 1);
    } else {
        activeFilters.push(label);
    }

    return activeFilters;
};

var utteranceMatchesLabel = function(utterance, label) {
    return utterance.speakerType === label.speakerType && utterance.utteranceCodes.includes(label.code);
}

var getLabelIndex = function(activeFilters, label) {
    var index = activeFilters.findIndex(filter => {
        return filter.speakerType === label.speakerType && filter.code === label.code;
    });

    return index;
}

var filtersIncludeLabel = function(activeFilters, label) {
    return activeFilters.some(filter => label.speakerType === filter.speakerType && label.code === filter.code);
}

export { changeActiveFilters, utteranceMatchesLabel, getLabelIndex, filtersIncludeLabel };
