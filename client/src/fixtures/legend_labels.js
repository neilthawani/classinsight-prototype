// Color names: htmlcsscolor.com
// Color ideation: colorhexa.com
// Color palette ideation: color-hex.com/color-palettes/

var colors = {
    Teacher: {
        "Purple": "#800080",
        "Navy": "#000080",
        "Electric indigo": "#6600ff",
        "Blue bayoux": "#607b7d",
        "Teal": "#008080",
        "Aqua": "#00ffff",
        "Lime": "#3cdc14",
        "Olive": "#808000",
    },
    Student: {
        "Brown": "#a52a2a",
        "Maroon": "#800000",
        "Crimson": "#DC143C",
        "Salmon": "#FA8072",
        "Pink": "#ffc0cb",
        "Orange red": "#ff4500",
        "Orange": "#ffa500",
        "Gold": "#ffd700"
    }
};

var legendDict = {
    "Teacher": {
        "C": {
            value: "Connect",
            barColor: colors["Teacher"]["Navy"],
            textColor: "white",
        },
        "G": {
            value: "Guide Direction of Dialogue or Activity",
            barColor: colors["Teacher"]["Electric indigo"],
            textColor: "white",
        },
        "I": {
            value: "Invite Elaboration or Reasoning",
            barColor: colors["Teacher"]["Purple"],
            textColor: "white",
        },
        "R": {
            value: "Make Reasoning Explicit",
            barColor: colors["Teacher"]["Teal"],
            textColor: "white",
        },
        "B": {
            value: "Build on Ideas",
            barColor: colors["Teacher"]["Blue bayoux"],
            textColor: "white",
        },
        "EV": {
            value: "Evaluation",
            barColor: colors["Teacher"]["Olive"],
            textColor: "white",
        },
        "E": {
            value: "Express or Invite Ideas",
            barColor: colors["Teacher"]["Lime"],
            textColor: "black",
        },
        "OTT": {
            value: "Other Teacher Talk",
            barColor: colors["Teacher"]["Aqua"],
            textColor: "black",
        },
        // "OT": {
        //     value: "Other Talk",
        //     barColor: "#000",
        //     textColor: "white",
        // },
    },
    "Student": {
        "C": {
            value: "Connect",
            barColor: colors["Student"]["Maroon"],
            textColor: "white",
        },
        "G": {
            value: "Guide Direction of Dialogue or Activity",
            barColor: colors["Student"]["Brown"],
            textColor: "white",
        },
        "I": {
            value: "Invite Elaboration or Reasoning",
            barColor: colors["Student"]["Crimson"],
            textColor: "white",
        },
        "R": {
            value: "Make Reasoning Explicit",
            barColor: colors["Student"]["Orange red"],
            textColor: "white",
        },
        "B": {
            value: "Build on Ideas",
            barColor: colors["Student"]["Salmon"],
            textColor: "white",
        },
        "EV": {
            value: "Evaluation",
            barColor: colors["Student"]["Pink"],
            textColor: "black",
        },
        "E": {
            value: "Express or Invite Ideas",
            barColor: colors["Student"]["Orange"],
            textColor: "black",
        },
        "OST": {
            value: "Other Student Talk",
            barColor: colors["Student"]["Gold"],
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
