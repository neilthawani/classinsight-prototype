import { legendDict, legendLabels } from '../../../fixtures/legend_labels';

export default function defineInitialStyle(item) {
    // var legendLabelValue = item.utteranceTypes[item.utteranceTypes.length - 1],
    //     matchingLegendObj = legendLabels.find(item => item.text === legendLabelValue);
    // debugger;
    var matchingLegendObjs = item.utteranceCodes.map((code) => {
        return legendDict[item.speakerType][code];
    });
    // var matchingLegendObj = legendDict[item.speakerType][item.utteranceCodes[0]];
    // console.log("matchingLegendObj", matchingLegendObj);

    if (matchingLegendObjs.length > 1) {  // if it has multiple utterance types, draw a border around the bar

    }

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
