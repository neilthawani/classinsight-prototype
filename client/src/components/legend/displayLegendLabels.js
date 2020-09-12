import LegendLabels from '../../fixtures/legend_labels';

export default function(options) {
    return LegendLabels.filter((item) => item.type === options.type);
};
