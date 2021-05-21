import { legendLabels } from '../fixtures/legend_labels';
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
    "EPISODES": "episodes", // episode is a turn or cluster of sentences pertaining to a speaker
    "SEQUENCES": "sequences", // not sure what this is
    "SPEAKER": "speakerPseudonym",
    "TIME STAMP": "timestamp", // no timestamp for online entries - unless in breakout room
    "TURN #": "id",
    "UTTERANCE": "utterance"
};

var mutateSpeakerPseudonym = function(value) {
    return value.replace(":", "").replace("_", " ");
};

var knownSpeakerPseudonyms = [
  "Andi",
  "Katherine",
  "Video",
  "Audio",
  "Ung-Sang"
];

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
        // console.log('lineDatum.toString().length', lineDatum.toString().length);
        if (lineDatum.join("") === "") {
            return prev;
        }

        var dataRow = {};

        lineDatum.forEach((value, jindex, jarray) => {
            var key = headers[jindex];
            var replacementKey = headerDict[key];
            value = value.trim();
            // console.log('value', value);

            if (replacementKey === "speakerPseudonym") {
                value = mutateSpeakerPseudonym(value);
            }

            // begin error checking
            // line datum 5 is the CHAT/breakoutRoom column
            // speakerPseudonym is assigned to SPEAKER (in-classroom) or CHAT WRITER (in-videoconference) speakers
            // utterance (in-classroom) and breakoutRoom (in-videoconference) should be on each line
            if (replacementKey === "utterance" && !value && !lineDatum[5]) {
                // console.log('uh oh');
                // debugger;
                // console.log('lineDatum.toString().length', lineDatum.toString().length, lineDatum);
                warnings.push(`Fatal error: No utterance in utterance row ${lineDatum[0]}`);
            }

            // speakerPseudonym can either be in SPEAKER column or CHAT WRITER column
            if (key === "SPEAKER" && !lineDatum[4] && !(value.includes("Student") || value.includes("Teacher")) && !knownSpeakerPseudonyms.includes(value)) {
                // console.log('value', value);
                var codeValues = [];
                if (lineDatum[8]) {
                    codeValues.push(lineDatum[8]);
                }

                if (lineDatum[9]) {
                    codeValues.push(lineDatum[9]);
                }

                var codeLabel = codeValues.length > 1 ? "codes" : "code";

                warnings.push(`Unrecognized speaker pseudonym in utterance row ${lineDatum[0]}: ${value} (utterance ${codeLabel}: ${codeValues})`);
            }

            if (key === "CHAT WRITER" && !lineDatum[1] && !(value.includes("Student") || value.includes("Teacher")) && !knownSpeakerPseudonyms.includes(value)) {
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

            // console.log('teacherCodes', teacherCodes)

            if (replacementKey === "utteranceCodes" && !lineDatum[8] && !lineDatum[9]) {
                const warning = `Fatal error: No utterance codes in utterance row ${lineDatum[0]}`;

                if (!warnings.includes(warning)) {
                    warnings.push(warning);
                }
            }

            var mutatedSpeakerPseudonym = mutateSpeakerPseudonym(lineDatum[1]);

            var flagAllUtteranceCodeErrors = true;
            if (replacementKey === "utteranceCodes" && mutatedSpeakerPseudonym.endsWith("Teacher") && value && !teacherCodes.includes(value)) {
                // console.log('value', value, typeof value, value.constructor, value.length);
                // console.log("mutateSpeakerPseudonym(lineDatum[1])", mutateSpeakerPseudonym(lineDatum[1]));
                warnings.push(`Unrecognized code for speaker pseudonym ${mutatedSpeakerPseudonym} in utterance row ${lineDatum[0]}: ${value}`);
                flagAllUtteranceCodeErrors = false;
            }

            // two checks for speaker pseudonym here because "Student Teacher" is a known pseudonym
            if (replacementKey === "utteranceCodes" && mutatedSpeakerPseudonym.startsWith("Student") && !mutatedSpeakerPseudonym.endsWith("Teacher") && value && !studentCodes.includes(value)) {
                warnings.push(`Unrecognized code for speaker pseudonym ${mutatedSpeakerPseudonym} in utterance row ${lineDatum[0]}: ${value}`);
                flagAllUtteranceCodeErrors = false;
            }

            // ensures only Students are OST or Teachers are OTT - otherwise it gives a warning
            if (replacementKey === "utteranceCodes" && !flagAllUtteranceCodeErrors) {
                for (var i = 8; i < 10; i++) {
                    var code = lineDatum[i];

                    var notAStudent = code === "OST" && (!lineDatum[1].includes("Student") && !lineDatum[4].includes("Student"));
                    var notATeacher = code === "OTT" && (!lineDatum[1].includes("Teacher") && !lineDatum[4].includes("Teacher")) && !knownSpeakerPseudonyms.includes(lineDatum[1]) && !knownSpeakerPseudonyms.includes(lineDatum[4]);

                    if (notAStudent || notATeacher) {
                        warnings.push(`Unrecognized speaker pseudonym in utterance row ${lineDatum[0]}: ${lineDatum[1] || lineDatum[4]} (code: ${code})`);
                    }
                }
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
