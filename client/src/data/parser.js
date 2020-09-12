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
                        var utteranceType = utterance.utterance_type.length === 0 ? ["Unknown"] : utterance.utterance_type,
                            unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                                (speakingTurn.speaker_pseudonym.includes("Class") ||
                                speakingTurn.speaker_pseudonym.includes("Student")),
                            unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                                speakingTurn.speaker_pseudonym.includes("Teacher"),
                            dataRow = {
                                id: utteranceIndex++,
                                timestamp: [],
                                speakerPseudonym: speakingTurn.speaker_pseudonym,
                                utterance: utterance.utterance,
                                utteranceType: utteranceType,
                                nTokens: utterance.n_tokens
                            };

                        if (utterance.timestamp.length) {
                            dataRow.timestamp.push(utterance.timestamp);
                        }

                        if (unclassifiedStudentTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Student Talk"] } };
                        } else if (unclassifiedTeacherTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Teacher Talk"] } };
                        } else {
                            dataRow = { ...dataRow, ...{ types: utterance.utterance_type } };
                        }

                        transcript[transcript.length - 1].utterances.push(dataRow);
                    });
                });
            }
        });

        return transcript;
    },
    expandedData: function() {
        var transcript = this.transcript();
        return transcript.reduce((accumulator, turn, index, array) => {
            return accumulator.concat(turn.utterances);
        }, []);
    },
    collapsedData: function() {
        var expandedData = this.expandedData(),
            collapsedData = [];

        expandedData.map((utterance, index, array) => {
            var dataRow = { ...utterance },
                sameUtteranceTypesAsPrevious = false,
                previousDataRow = {};

            if (collapsedData.length > 0) {
                previousDataRow = { ...collapsedData[collapsedData.length - 1] };
                sameUtteranceTypesAsPrevious = JSON.stringify(previousDataRow.utteranceType) === JSON.stringify(dataRow.utteranceType);
            }

            if (sameUtteranceTypesAsPrevious) {
                collapsedData[collapsedData.length - 1].nTokens = previousDataRow.nTokens + dataRow.nTokens;
                collapsedData[collapsedData.length - 1].timestamp.push(...dataRow.timestamp);
            }

            if (collapsedData.length === 0 || (collapsedData.length > 0 && !sameUtteranceTypesAsPrevious)) {
                collapsedData.push(dataRow);
            }
        });

        return collapsedData;
    },

    parsedData: function() {
        var expandedData = this.expandedData(),
            collapsedData = this.collapsedData();

        var parsedData = {
            "expanded": expandedData,
            "collapsed": collapsedData
        };

        return parsedData;
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
    },
}
