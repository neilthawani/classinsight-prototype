// import LegendLabels from '../../fixtures/legend_labels';
import Parser from '../../data/parser';

export default function(options) {
    var talkRatios = Parser.talkRatios();
    // console.log("talkRatios", talkRatios);
    var legendLabels = talkRatios.filter((item) => item.type === options.type);
    // console.log("legendLabels", legendLabels);
    return legendLabels;
};
