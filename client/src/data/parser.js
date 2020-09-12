import data from './data';

export default {
    segments: data[0].data.segments,

    transcript: function() {
        var transcript = [];

        this.segments.forEach((segment, index, array) => {
            var utteranceIndex = 0;

            if (segment.participation_type !== "Other") {
                var speakingTurns = segment.speaking_turns;

                speakingTurns.forEach((speakingTurn, jindex, jarray) => {
                    transcript.push({
                        speakerPseudonym: speakingTurn.speaker_pseudonym,
                        speakerType: speakingTurn.speaker_type,
                        initialTime: speakingTurn.initial_time,
                        endTime: speakingTurn.end_time,
                        utterances: []
                    });

                    speakingTurn.utterances.forEach((utterance, kindex, karray) => {
                        var utteranceType = utterance.utterance_type.length === 0 ? ["Unknown"] : utterance.utterance_type;

                        transcript[transcript.length - 1].utterances.push({
                            id: utteranceIndex++,
                            timestamp: utterance.timestamp,
                            utterance: utterance.utterance,
                            utteranceType: utteranceType,
                            nTokens: utterance.n_tokens
                        });
                    });
                });
            }
        });

        console.log("transcript", transcript);
        return transcript;
    },

    parsedData: function(isCollapsed) {
        var parsedData = [];

        this.segments.forEach((segment, index, array) => {
            var utteranceIndex = 0;

            if (segment.participation_type !== "Other") {
                var speakingTurns = segment.speaking_turns;

                speakingTurns.forEach((speakingTurn, jindex, jarray) => {
                    var utterances = speakingTurn.utterances;
                    utterances.forEach((utterance, kindex, karray) => {
                        var unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                                (speakingTurn.speaker_pseudonym.includes("Class") ||
                                speakingTurn.speaker_pseudonym.includes("Student")),
                            unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                                speakingTurn.speaker_pseudonym.includes("Teacher"),
                            dataRow = {
                                id: utteranceIndex++,
                                utterance: utterance.utterance,
                                speakerPseudonym: speakingTurn.speaker_pseudonym,
                                nTokens: utterance.n_tokens,
                                time: []
                            };

                        if (unclassifiedStudentTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Student Talk"] } };
                        } else if (unclassifiedTeacherTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Teacher Talk"] } };
                        } else {
                            dataRow = { ...dataRow, ...{ types: utterance.utterance_type } };
                        }

                        if (isCollapsed && parsedData.length > 0) {
                            parsedData = this.collapseTimes(parsedData, dataRow, utterance);
                        } else {
                            if (!isCollapsed) dataRow.time.push(utterance.timestamp);
                            parsedData.push(dataRow);
                        }
                    });
                });
            }
        });

        console.log("parsedData", parsedData);
        return parsedData;
    },

    collapseTimes: function(allData, dataRow, utterance) {
        if (utterance.timestamp.length > 0) {
            dataRow.time.push(utterance.timestamp);
        }

        var previousDataRow = allData[allData.length - 1],
            sameUtteranceTypesAsPrevious = JSON.stringify(previousDataRow.types) === JSON.stringify(dataRow.types);

        if (sameUtteranceTypesAsPrevious) {
            previousDataRow.nTokens += dataRow.nTokens;
            previousDataRow.time.push(...dataRow.time);
        } else {
            allData.push(dataRow);
        }

        return allData;
    },

    focusTranscript: function(transcript, targetUtterance, options) {
        var rangeMin = options.range.min || 1,
            rangeMax = options.range.max || 1
        var activeTurnIndex = 0;

        for (var i = 0; i < transcript.length; i++) {
            var turn = transcript[i];
            var utteranceIndex = turn.utterances.findIndex((utteranceObj) => {
                return utteranceObj.id === targetUtterance.id && utteranceObj.utterance === targetUtterance.utterance;
            });

            if (utteranceIndex !== -1 ) {
                activeTurnIndex = i;
                break;
            }
        }

        // if minSlice < 0, this breaks due to how slice works
        var minSlice = activeTurnIndex - rangeMin < 0 ? 0 : activeTurnIndex - rangeMin;

        return transcript.slice(minSlice, activeTurnIndex + 1 + rangeMax);
    }
}
