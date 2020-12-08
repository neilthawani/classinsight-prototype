import LegendLabels from '../../../fixtures/legend_labels';
var legendLabels = LegendLabels;

export default function(item) {
    var legendLabelValue = item.utteranceTypes[item.utteranceTypes.length - 1],
        matchingLegendObj = legendLabels.find(item => item.value === legendLabelValue);

    var textColor = matchingLegendObj.textColor;
    var barColor = matchingLegendObj.barColor;
    var barBorder = "";
    var boxSizing = "";
    if (item.utteranceTypes.length > 1) { // if it has multiple utterance types, draw a border around the bar
        var borderValue = item.utteranceTypes && item.utteranceTypes[0];
        barBorder = `3px solid ${legendLabels.find(item => item.value === borderValue).barColor}`;
        boxSizing = "border-box";
    }

    return {
        color: textColor,
        backgroundColor: barColor,
        border: barBorder,
        boxSizing: boxSizing
    };
}
