// import Parser from '../../data/parser';

// options: { type: "Student" || "Teacher" }
export default function(talkRatios, options) {
    // var talkRatios = Parser.talkRatios();

    var legendLabels = talkRatios.filter((item) => item.type === options.type);
    return legendLabels;
};
