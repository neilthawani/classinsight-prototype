var utteranceMatchesLabel = function(utterance, label) {
    return utterance.speakerType === label.speakerType && utterance.utteranceCodes.includes(label.code);
}

var filtersIncludeLabel = function(activeFilters, label) {
    return activeFilters.some(filter => label.speakerType === filter.speakerType && label.code === filter.code);
}

// TODO: Consolidate into changeActiveFilters

export { utteranceMatchesLabel, filtersIncludeLabel };
