import { readString } from 'react-papaparse';

var metaHeaderDict = {
    "Field Notes File Name": "filename",//"20201210_Evan_Per3_4_FieldNotes_Dennis"
    "Instructor": "instructor",//"Evan"
    "Lesson": "lessonName",//"Project Check-in"
    "Period": "periods",//"3/4"
    "Pre-interview": "",//"Today I am just checking in with students on their project/assessment to see if they have any questions or need help. Goal is to make sure that they are ready to turn the assignment in this week."
    "Subject": "subject"//"Science"
};

var headerDict = {
    "CLUSTER CODES (R, E, I, B, P, C)": "utteranceCodes",
    // "CLUSTER CODES": "utteranceTypes",
    "SPEAKER": "speakerPseudonym",
    "TIME STAMP": "timestamp",
    "TURN #": "id",
    "UTTERANCE": "utterance"
};

var csvToJson = function(contents) {
    var parsedCsv = readString(contents);
    var lines = parsedCsv.data;

    var metadataHeaders = lines[0];
    var metadata = lines[1];
    var metaContents = metadataHeaders.reduce((prev, item, index, array) => {
        var key = metaHeaderDict[metadataHeaders[index]];
        var value = metadata[index];

        if (key && value) {
            prev[key] = value;
        }

        return prev;
    }, {});

    console.log("metaContents", metaContents);

    // var data = {
    //     // segments: [{
    //         utterances: []
    //     // }]
    // };
    var headers = lines[2];
    var lineData = lines.splice(3);

    // TODO: Utterance key dict is resulting in undefined. Why?
    var dataRows = lineData.map((lineDatum, index, array) => {
        var dataRow = {};
        lineDatum.forEach((value, jindex, jarray) => {
            var key = headers[jindex];
            var replacementKey = headerDict[key];
            // console.log("key", key);

            if (replacementKey === "speakerPseudonym") {
                value = value.replace(":", "");
            }

            if (dataRow.hasOwnProperty(key) && value) {
                console.log("uh oh");
                dataRow[replacementKey] = [ dataRow[replacementKey], ...value ];
            } else if (value) {
                dataRow[replacementKey] = value;
            }
        });

        // nTokens !!!

        return dataRow;
    });

    // data.segments[0].speaking_turns = dataRows;
    // data.utterances = dataRows;

    var jsonData = {
        ...metaContents,
        utterances: dataRows
    };

    console.log("jsonData", jsonData);

    return jsonData;// };
};

export default csvToJson;
