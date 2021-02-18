var legendDict = {
    "Student": {
        "C": {
            value: "Connect",
            barColor: "#370617",
            textColor: "white",
        },
        "G": {
            value: "Guide Direction of Dialogue or Activity",
            barColor: "#6A040F",
            textColor: "white",
        },
        "I": {
            value: "Invite Elaboration or Reasoning",
            barColor: "#9D0208",
            textColor: "white",
        },
        "R": {
            value: "Make Reasoning Explicit",
            barColor: "#D00000",
            textColor: "white",
        },
        "B": {
            value: "Build on Ideas",
            barColor: "#E85D04",
            textColor: "white",
        },
        "EV": {
            value: "Evaluation",
            barColor: "#F48C06",
            textColor: "white",
        },
        "E": {
            value: "Express or Invite Ideas",
            barColor: "#FAA307",
            textColor: "black",
        },
        "OST": {
            value: "Other Student Talk",
            barColor: "#FFBA08",
            textColor: "black",
        },
    },
    "Teacher": {
        "C": {
            value: "Connect",
            barColor: "#03045E",
            textColor: "white",
        },
        "G": {
            value: "Guide Direction of Dialogue or Activity",
            barColor: "#023E8A",
            textColor: "white",
        },
        "I": {
            value: "Invite Elaboration or Reasoning",
            barColor: "#0077B6",
            textColor: "white",
        },
        "R": {
            value: "Make Reasoning Explicit",
            barColor: "#0096C7",
            textColor: "white",
        },
        "B": {
            value: "Build on Ideas",
            barColor: "#00B4D8",
            textColor: "white",
        },
        "EV": {
            value: "Evaluation",
            barColor: "#48CAE4",
            textColor: "black",
        },
        "E": {
            value: "Express or Invite Ideas",
            barColor: "#90E0EF",
            textColor: "black",
        },
        "OTT": {
            value: "Other Teacher Talk",
            barColor: "#ADE8F4",
            textColor: "black",
        },
        "OT": {
            value: "Other Talk",
            barColor: "#CAF0F8",
            textColor: "black",
        },
    }
};

var speakerTypes = Object.keys(legendDict);
var legendLabels = speakerTypes.reduce((prev, type) => {
    var codes = Object.keys(legendDict[type]);

    codes.forEach((code) => {
        prev.push({
            ...legendDict[type][code],
            code: code,
            speakerType: type,
        });
    });

    return prev;
}, []);

export { legendLabels, legendDict };
