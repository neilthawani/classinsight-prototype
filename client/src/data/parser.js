import data from './data';

export default {
    segments: data[0].data.segments,

    transcript: function() {
        var transcript = [];

        this.segments.forEach((segment, index, array) => {
            var utteranceIndex = 0;

            if (segment.participation_type !== "Other") {
                var speakingTurns = segment.speaking_turns;
                speakingTurns.forEach((turn, jindex, jarray) => {
                    var speaker = turn.speaker_pseudonym;
                    var start = turn.initial_time;
                    var end = turn.end_time;

                    transcript.push({speaker: speaker, start: start, end: end, utterances: []})

                    turn.utterances.forEach((utterance, kindex, karray) => {
                        var utteranceType = utterance.utterance_type.length === 0 ? ["Unknown"] : utterance.utterance_type;

                        transcript[transcript.length - 1].utterances.push({
                            id: utteranceIndex++,
                            timestamp: utterance.timestamp,
                            utterance: utterance.utterance,
                            type: utteranceType
                        });
                    });
                });
            }
        });

        return transcript;
    },

    expandedData: function() {
        return this.segments.reduce((allData, seg, index, array) => {
            var utteranceIndex = 0;

            if (seg.participation_type !== "Other") {
                const turn = seg.speaking_turns;

                for (const talk of turn) {
                    for (const utterance of talk.utterances) {
                        var unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                                (talk.speaker_pseudonym.includes("Class") ||
                                talk.speaker_pseudonym.includes("Student")),
                            unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                                talk.speaker_pseudonym.includes("Teacher"),
                            dataRow = {
                                id: utteranceIndex++,
                                utterance: utterance.utterance,
                                speaker: talk.speaker_pseudonym,
                                length: utterance.n_tokens,
                                time: utterance.timestamp
                            };

                        if (unclassifiedStudentTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Student Talk"] } };
                        } else if (unclassifiedTeacherTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Teacher Talk"] } };
                        } else {
                            dataRow = { ...dataRow, ...{ types: utterance.utterance_type } };
                        }

                        allData.push(dataRow);
                    }
                }
            }

            return allData;
        }, []);
    },

    collapsedData: function() {
        return this.segments.reduce((allData, seg, index, array) => {
            var utteranceIndex = 0;

            if (seg.participation_type !== "Other") { // this excludes a great deal of the transcript
                const turn = seg.speaking_turns;

                for (const talk of turn) {
                    for (const utterance of talk.utterances) {
                        var unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                                (talk.speaker_pseudonym.includes("Class") ||
                                talk.speaker_pseudonym.includes("Student")),
                            unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                                talk.speaker_pseudonym.includes("Teacher"),
                            dataRow = {
                                id: utteranceIndex++,
                                utterance: utterance.utterance,
                                speaker: talk.speaker_pseudonym,
                                length: utterance.n_tokens,
                                time: []
                            };

                            if (utterance.timestamp.length > 0) {
                                dataRow.time.push(utterance.timestamp);
                            }

                        // categorize student and teacher talk for talk that has no utterance types
                        if (unclassifiedStudentTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Student Talk"] } };
                        } else if (unclassifiedTeacherTalk) {
                            dataRow = { ...dataRow, ...{ types: ["Assorted Teacher Talk"] } };
                        } else {
                            dataRow = { ...dataRow, ...{ types: utterance.utterance_type } };
                        }

                        if (allData.length === 0) {
                            allData.push(dataRow);
                        } else {
                            var previousDataRow = allData[allData.length - 1],
                                sameUtteranceTypesAsPrevious = JSON.stringify(previousDataRow.types) === JSON.stringify(dataRow.types);

                            if (sameUtteranceTypesAsPrevious) {
                                previousDataRow.length += dataRow.length;
                                previousDataRow.time.push(...dataRow.time);
                            } else {
                                allData.push(dataRow);
                            }
                        }
                    }
                }
            }

            return allData;
        }, []);
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
