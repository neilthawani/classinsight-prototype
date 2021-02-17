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

    var textColor = matchingLegendObjs[0].textColor;
    var barColor = matchingLegendObjs[0].barColor;
    var barBorder = "";
    var boxSizing = "";

    if (matchingLegendObjs.length > 1) {  // if it has multiple utterance types, draw a border around the bar
        barBorder = `3px solid ${matchingLegendObjs[1].barColor}`;
        boxSizing = "border-box";
    }

    // if (item.utteranceTypes.length > 1) { // if it has multiple utterance types, draw a border around the bar
        // var borderValue = matchingLegendObjs && matchingLegendObjs.utteranceTypes[0];

    // }

    return {
        color: textColor,
        backgroundColor: barColor,
        border: barBorder,
        boxSizing: boxSizing
    };
}
