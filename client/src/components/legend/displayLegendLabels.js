import Parser from '../../data/parser';

export default function(options) {
    var talkRatios = Parser.talkRatios();

    var legendLabels = talkRatios.filter((item) => item.type === options.type);
    return legendLabels;
};
