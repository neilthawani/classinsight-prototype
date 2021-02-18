import removeArrayValue from '../../utils/removeArrayValue';
import { filtersIncludeLabel } from './compareToLabel';

const changeActiveFilters = function(activeFilters, label) {
    var isFilterActive = filtersIncludeLabel(activeFilters, label);

    if (isFilterActive) {
        activeFilters = removeArrayValue(label, activeFilters)
    } else {
        activeFilters.push(label);
    }

    return activeFilters;
};

export default changeActiveFilters;
