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
        "Black": "#000"
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

var definitions = {
    "C": "Linking ideas to prior contirbutions made in class and/or contexts and information from outside the class.", // connect
    "G": "Guiding or scaffolding conversations and activities in class by highlighting key ideas and/or setting up process for further argumentation and discussion.", // guide direction of dialogue or dialogic activity
    "I": "The speaker invites responses to either add to an idea or explicitly reason out an idea providing further information.", // invite elaboration or reasoning
    "R": "The speaker explicitly explains their thought process behind an answer/proposition.", // make reasoning explicit
    "B": "Adding more information to your/others ideas. Generally done by adding further examples or explanations.", // build on ideas
    "EV": "Statements that evaluate contributions. Includes corroborating correct facts and repeating students responses to confirm their contribution.", // evaluation
    "E": "Statements that express or invite ideas that are new (not connected to previous contributions).", // express or invite ideas
    "OTT": "Teacher talk that does not fit into oher categories. Includes lecturing and progress/task checks.", // other teacher talk
    "OST": "Student talk that does not fit into oher categories. Includes responses and questions that are procedural, like responding to attendance.", // other student talk
    "OT": "Extra conversation that includes people beyond the teacher and students." // other talk
};

var legendDict = {
    "Teacher": {
        "C": {
            value: "Connect",
            barColor: colors["Teacher"]["Navy"],
            textColor: "white",
            description: definitions["C"]
        },
        "G": {
            value: "Guide Direction of Dialogue or Activity",
            barColor: colors["Teacher"]["Electric indigo"],
            textColor: "white",
            description: definitions["G"]
        },
        "I": {
            value: "Invite Elaboration or Reasoning",
            barColor: colors["Teacher"]["Purple"],
            textColor: "white",
            description: definitions["I"]
        },
        "R": {
            value: "Make Reasoning Explicit",
            barColor: colors["Teacher"]["Teal"],
            textColor: "white",
            description: definitions["R"]
        },
        "B": {
            value: "Build on Ideas",
            barColor: colors["Teacher"]["Blue bayoux"],
            textColor: definitions["B"]
        },
        "EV": {
            value: "Evaluation",
            barColor: colors["Teacher"]["Olive"],
            textColor: "white",
            description: definitions["EV"]
        },
        "E": {
            value: "Express or Invite Ideas",
            barColor: colors["Teacher"]["Lime"],
            textColor: "black",
            description: definitions["E"]
        },
        "OTT": {
            value: "Other Teacher Talk",
            barColor: colors["Teacher"]["Aqua"],
            textColor: "black",
            description: definitions["OTT"]
        },
        "OT": {
            value: "Other Talk",
            barColor: colors["Teacher"]["Black"],
            textColor: "white",
            description: definitions["OT"]
        },
    },
    "Student": {
        "C": {
            value: "Connect",
            barColor: colors["Student"]["Maroon"],
            textColor: "white",
            description: definitions["C"]
        },
        "G": {
            value: "Guide Direction of Dialogue or Activity",
            barColor: colors["Student"]["Brown"],
            textColor: "white",
            description: definitions["G"]
        },
        "I": {
            value: "Invite Elaboration or Reasoning",
            barColor: colors["Student"]["Crimson"],
            textColor: "white",
            description: definitions["I"]
        },
        "R": {
            value: "Make Reasoning Explicit",
            barColor: colors["Student"]["Orange red"],
            textColor: "white",
            description: definitions["R"]
        },
        "B": {
            value: "Build on Ideas",
            barColor: colors["Student"]["Salmon"],
            textColor: "white",
            description: definitions["B"]
        },
        "EV": {
            value: "Evaluation",
            barColor: colors["Student"]["Pink"],
            textColor: "black",
            description: definitions["EV"]
        },
        "E": {
            value: "Express or Invite Ideas",
            barColor: colors["Student"]["Orange"],
            textColor: "black",
            description: definitions["E"]
        },
        "OST": {
            value: "Other Student Talk",
            barColor: colors["Student"]["Gold"],
            textColor: "black",
            description: definitions["OST"]
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
