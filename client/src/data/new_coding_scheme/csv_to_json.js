import { readString } from 'react-papaparse';

var metaHeaderDict = {
    "Field Notes File Name": "filename",//"20201210_Evan_Per3_4_FieldNotes_Dennis"
    "Instructor": "instructor",//"Evan"
    "Lesson": "lessonName",//"Project Check-in"
    "Period": "classPeriod",//"3/4"
    "Pre-interview": "",//"Today I am just checking in with students on their project/assessment to see if they have any questions or need help. Goal is to make sure that they are ready to turn the assignment in this week."
    "Subject": "classTopic"//"Science"
};

var headerDict = {
    "CHAT": "utterance",
    "CHAT WRITER": "speakerPseudonym",
    "CLUSTER CODES (R, E, I, B, P, C)": "utteranceCodes",
    "COMMENTS": "comments",
    // "CLUSTER CODES": "utteranceTypes",
    "EPISODES": "episodes", // not sure what this is
    "SEQUENCES": "sequences", // not sure what this is
    "SPEAKER": "speakerPseudonym",
    "TIME STAMP": "timestamp", // no timestamp for online entries
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
            // console.log("value", value);
        }

        if (replacementKey && value) {
            prev[replacementKey] = value;
        }

        return prev;
    }, {});

    // var fileMetadata = ;
    //     var classDate = fileMetadata[0],
    //         classDate =
    // }

    // grab filename, split by _
    // date is at index 0, parse date
    metaContents["classDate"] = metaContents["filename"].split("_")[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

    // console.log("metaContents", metaContents);

    // var data = {
    //     // segments: [{
    //         utterances: []
    //     // }]
    // };
    var headers = lines[2];
    var lineData = lines.splice(3);

    var dataRows = lineData.reduce((prev, lineDatum, index, array) => {
        // console.log("lineDatum", lineDatum);
        if (!lineDatum.toString().length) {
            return prev;
        }

        var dataRow = {};

        lineDatum.forEach((value, jindex, jarray) => {
            var key = headers[jindex];
            var replacementKey = headerDict[key];
            value = value.trim();
            // if (replacementKey === undefined)
            //     console.log("key", key, "replacementKey", replacementKey);

            if (replacementKey === "speakerPseudonym") {
                value = value.replace(":", "").replace("_", " ");
            }

            if (replacementKey === "utteranceCodes" && !dataRow[replacementKey]) {
                value = [ value ];
            }

            // console.log("key", key, value);
            if (key === "CHAT" && value) {
                dataRow["isChat"] = true;
            }

            if (dataRow[replacementKey] && value) {
                // console.log("uh oh");
                dataRow[replacementKey] = [ ...dataRow[replacementKey], ...value ];
            // } else if (replacementKey === "utteranceCodes" && value) {
                // dataRow[replacementKey] = [ value ];
            } else if (value) {
                dataRow[replacementKey] = value;
            }
        });

        // nTokens !!!

        prev.push(dataRow);
        return prev;
    }, []);

    // data.segments[0].speaking_turns = dataRows;
    // data.utterances = dataRows;

    var jsonData = {
        ...metaContents,
        utterances: dataRows
    };

    // console.log("jsonData", jsonData);

    return jsonData;// };
};

export default csvToJson;
