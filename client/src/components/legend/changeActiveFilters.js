import removeArrayValue from '../../utils/removeArrayValue';

const changeActiveFilters = function(activeFilters, label) {
    var isFilterActive = activeFilters.some(filter => label.speakerType === filter.speakerType && label.code === filter.code);

    if (isFilterActive) {
        activeFilters = removeArrayValue(label, activeFilters)
    } else {
        activeFilters.push(label);
    }

    return activeFilters;
};

export default changeActiveFilters;
