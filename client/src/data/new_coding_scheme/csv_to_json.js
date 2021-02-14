import { readString } from 'react-papaparse';

var headerDict = {
    "CLUSTER CODES (R, E, I, B, P, C)": "utteranceTypes",
    "CLUSTER CODES": "utteranceTypes",
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
        var key = metadataHeaders[index]
        var value = metadata[index];

        if (value) {
            prev[key] = value;
        }

        return prev;
    }, {});

    var data = {
        segments: [{
            speaking_turns: []
        }]
    };
    var headers = lines[2];
    var lineData = lines.splice(3);

    var dataRows = lineData.map((lineDatum, index, array) => {
        var dataRow = {};
        lineDatum.forEach((value, jindex, jarray) => {
            var key = headers[jindex];
            // console.log("key", key);

            if (dataRow.hasOwnProperty(key)) {
                console.log("uh oh");
                dataRow[key] = [ dataRow[key], value ];
            } else if (value) {
                dataRow[key] = value;
            }
        });

        // nTokens !!!

        return dataRow;
    });

    data.segments[0].speaking_turns = dataRows;

    var jsonData = {
        ...metaContents,
        ...data,
        isFromCsv: true
    };

    return { jsonData };
};

export default csvToJson;
