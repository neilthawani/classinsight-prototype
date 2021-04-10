import { readString } from 'react-papaparse';

var metaHeaderDict = {
    "Field Notes File Name": "filename", //"20201210_Evan_Per3_4_FieldNotes_Dennis"
    "Instructor": "instructor", //"Evan"
    "Lesson": "lessonName", //"Project Check-in"
    "Period": "classPeriod", //"3/4"
    "Pre-interview": "", //"Today I am just checking in with students on their project/assessment to see if they have any questions or need help. Goal is to make sure that they are ready to turn the assignment in this week."
    "Subject": "classTopic" //"Science"
};

// UTTERANCE is spoken, CHAT is written
// SPEAKER is spoken, CHAT WRITER is written
// CHAT might contain a written utterance + a breakout room
var headerDict = {
    "CHAT": "breakoutRoom", // can also be Utterance (Breakout Room #), depending on CSV coder
    "CHAT WRITER": "speakerPseudonym",
    "CLUSTER CODES (R, E, I, B, P, C)": "utteranceCodes",
    "COMMENTS": "comments",
    // "CLUSTER CODES": "utteranceTypes",
    "EPISODES": "episodes", // not sure what this is
    "SEQUENCES": "sequences", // not sure what this is
    "SPEAKER": "speakerPseudonym",
    "TIME STAMP": "timestamp", // no timestamp for online entries - unless in breakout room
    "TURN #": "id",
    "UTTERANCE": "utterance"
};

var csvToJson = function(contents) {
    var parsedCsv = readString(contents);
    var lines = parsedCsv.data;

    var metadataHeaders = lines[0];
    var metadata = lines[1];

    var metaContents = metadataHeaders.reduce((prev, item, index, array) => {
        var key = metadataHeaders[index];
        var replacementKey = metaHeaderDict[key];
        var value = metadata[index];
        value = value.trim();

        // parse and flatten as array
        if (replacementKey === "classPeriod") {
            value = [ ...value.split("/") ];
        }

        if (replacementKey && value) {
            prev[replacementKey] = value;
        }

        return prev;
    }, {});

    // grab filename, split by _
    // date is at index 0, parse date
    metaContents["classDate"] = metaContents["filename"].split("_")[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

    var headers = lines[2];
    var lineData = lines.splice(3);
    var warnings = [];

    var dataRows = lineData.reduce((prev, lineDatum, index, array) => {
        if (!lineDatum.toString().length) {
            return prev;
        }

        var dataRow = {};

        lineDatum.forEach((value, jindex, jarray) => {
            var key = headers[jindex];
            var replacementKey = headerDict[key];
            value = value.trim();

            if (replacementKey === "speakerPseudonym") {
                value = value.replace(":", "").replace("_", " ");
            }

            // begin error checking
            // line datum 5 is the CHAT/breakoutRoom column
            // speakerPseudonym is assigned to SPEAKER (in-classroom) or CHAT WRITER (in-videoconference) speakers
            // utterance (in-classroom) and breakoutRoom (in-videoconference) should be on each line
            if (replacementKey === "utterance" && !value && !lineDatum[5]) {
                warnings.push(`Fatal error: No utterance in utterance row ${lineDatum[0]}`);
            }

            if (key === "SPEAKER" && !(value.includes("Student") || value.includes("Teacher"))) {
                warnings.push(`Unrecognized speaker pseudonym in utterance row ${lineDatum[0]}: ${value}`);
            }

            var teacherCodes = legendLabels.reduce((prev, label) => {
                if (label.speakerType === "Teacher") {
                    prev.push(label.code);
                }

                return prev;
            }, [])

            var studentCodes = legendLabels.reduce((prev, label) => {
                if (label.speakerType === "Student") {
                    prev.push(label.code);
                }

                return prev;
            }, [])

            if (replacementKey === "utteranceCodes" && lineDatum[1].includes("Teacher") && !teacherCodes.includes(value)) {
                warnings.push(`Unrecognized code for speaker pseudonym ${lineDatum[1]} in utterance row ${lineDatum[0]}: ${value}`);
            }

            if (replacementKey === "utteranceCodes" && lineDatum[1].includes("Student") &&  !studentCodes.includes(value)) {
                warnings.push(`Unrecognized code for speaker pseudonym ${lineDatum[1]} in utterance row ${lineDatum[0]}: ${value}`);
            }
            // end error checking

            if (replacementKey === "utteranceCodes" && !dataRow[replacementKey]) {
                value = [ value ];
            }

            if (key === "CHAT" && value) {
                dataRow["isChat"] = true;
            }

            if (dataRow[replacementKey] && value) {
                dataRow[replacementKey] = dataRow[replacementKey].concat(value);
            } else if (value) {
                dataRow[replacementKey] = value;
            }
        });

        prev.push(dataRow);
        return prev;
    }, []);

    var jsonData = {
        ...metaContents,
        utterances: dataRows,
        warnings: warnings
    };

    return jsonData;
};

export default csvToJson;
