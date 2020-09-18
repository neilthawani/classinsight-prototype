import data from './data';
import LegendLabels from '../fixtures/legend_labels';
import removeArrayValue from '../utils/removeArrayValue';

export default {
    segments: data[0].data.segments,

    transcript: function() {
        var transcript = [];
        var utteranceIndex = 0;

        this.segments.forEach((segment, index, array) => {
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
                        var unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                                (speakingTurn.speaker_pseudonym.includes("Class") ||
                                speakingTurn.speaker_pseudonym.includes("Student")),
                            unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                                speakingTurn.speaker_pseudonym.includes("Teacher"),
                            dataRow = {
                                id: utteranceIndex++,
                                timestamp: [],
                                speakerPseudonym: speakingTurn.speaker_pseudonym,
                                utterance: utterance.utterance,
                                nTokens: utterance.n_tokens
                            };

                        if (utterance.timestamp.length) {
                            dataRow.timestamp.push(utterance.timestamp);
                        }

                        if (unclassifiedStudentTalk) {
                            dataRow = { ...dataRow, ...{ utteranceTypes: ["Assorted Student Talk"] } };
                        } else if (unclassifiedTeacherTalk) {
                            dataRow = { ...dataRow, ...{ utteranceTypes: ["Assorted Teacher Talk"] } };
                        } else {
                            dataRow = { ...dataRow, ...{ utteranceTypes: utterance.utterance_type } };
                        }

                        transcript[transcript.length - 1].utterances.push(dataRow);
                    });
                });
            }
        });

        return transcript;
    },

    filteredTranscript: function(filterValues) {
        var transcript = this.transcript(),
            filteredTranscript = [];
        // debugger;

        transcript.forEach((speakerTurn, index, array) => {
            var speakerTurnClone = { ...speakerTurn };

            // console.log("speakerTurn.utterances", speakerTurn.utterances);

            speakerTurn.utterances.forEach((utterance, jindex, jarray) => {
                // console.log("utterance", utterance);
                // var targetUtterance = "When you're looking for those things, you're paying attention and now you're learning.";

                // console.log("utterance === targetUtterance", targetUtterance === utterance.utterance);
                var isItemRemoved = utterance.utteranceTypes.filter((item, kindex, karray) => {
                    // console.log("item", item, "utteranceTypes", karray, filterValues, filterValues);
                    return filterValues.includes(item);
                });

                console.log("isItemRemoved", isItemRemoved);

                if (isItemRemoved.length === 0) {
                    // console.log("speakerTurnClone.utterances before", index, speakerTurn.utterances.length);
                    // speakerTurnClone.utterances = removeArrayValue(utterance, speakerTurn.utterances);
                    // console.log("speakerTurnClone.utterances after", index, speakerTurnClone.utterances.length);
                }
            });

            // speakerTurnClone.utterances =
            // console.log("speakerTurnClone.utterances", speakerTurnClone.utterances);
            filteredTranscript.push(speakerTurnClone);
        });
        // console.log("transcript", transcript);
        // console.log("filteredTranscript", filteredTranscript);

        return filteredTranscript;
    },

    expandedData: function() {
        var transcript = this.transcript();
        return transcript.reduce((accumulator, turn, index, array) => {
            return accumulator.concat(turn.utterances);
        }, []);
    },
    maxNTokens: function() {
        var expandedData = this.expandedData();
        return Math.max.apply(Math, expandedData.map((utterance) => utterance.nTokens));
    },
    collapsedData: function() {
        var expandedData = this.expandedData(),
            collapsedData = [];

        expandedData.forEach((utterance, index, array) => {
            var dataRow = { ...utterance },
                sameUtteranceTypesAsPrevious = false,
                previousDataRow = {};

            if (collapsedData.length > 0) {
                previousDataRow = { ...collapsedData[collapsedData.length - 1] };
                sameUtteranceTypesAsPrevious = JSON.stringify(previousDataRow.utteranceTypes) === JSON.stringify(dataRow.utteranceTypes);
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

    filteredData: function(parsedData, labelValues) {
        return parsedData.reduce((accumulator, item, index, array) => {
            var isItemRemoved = item.utteranceTypes.filter(item => labelValues.includes(item));

            if (isItemRemoved.length === 0) {
                accumulator.push(item);
            }

            return accumulator
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
    },


    talkRatios: function() {
        var expandedData = this.expandedData(), // get array of every utterance in the transcript
            legendLabels = LegendLabels,
            talkRatios = legendLabels.map((labelObj, index, array) => { // set up object to be returned
                return {
                    ...labelObj,
                    ...{ nTokens: 0, percentage: 0 }
                };
            }),
            // usually just speakerType: {Student, Teacher} with initialized totalNTokens
            speakerTotals = this.initializeSpeakerTotals();

        // calculate nTokens for each utterance type
        talkRatios.forEach((labelObj, index, array) => {
            expandedData.forEach((utterance, index, array) => {
                if (utterance.utteranceTypes.includes(labelObj.value)) {
                    labelObj.nTokens += utterance.nTokens;
                }
            });
        });

        // populate the initialized speakerTotals object
        // by calculating totalNTokens for each speakerType
        speakerTotals.forEach((totalObj, index, array) => {
            totalObj.totalNTokens = talkRatios
                                .filter((ratioObj) => ratioObj.speakerType === totalObj.speakerType)
                                .map((ratioObj) => ratioObj.nTokens)
                                .reduce((accumulator, nTokenValue, index, array) => {
                                    accumulator += nTokenValue;
                                    return accumulator;
                                }, 0);
        });

        // calculate the talk ratio percentage for each utterance type
        var allSpeakersTotalNTokens = speakerTotals
                                      .reduce((accumulator, item) => accumulator += item.totalNTokens, 0);

        talkRatios.forEach((ratioObj, index, array) => {
            ratioObj.percentage = ratioObj.nTokens / allSpeakersTotalNTokens;
        });

        return talkRatios;
    },
    initializeSpeakerTotals: function() {
        var legendLabels = LegendLabels;
        var speakerTotals = legendLabels.reduce((accumulator, labelObj, index, array) => {
            var speakerIsInArray = accumulator.filter((accumObj) => {
                return accumObj.speakerType === labelObj.speakerType;
            });

            if (speakerIsInArray.length === 0) {
                accumulator.push({
                    speakerType: labelObj.speakerType,
                    totalNTokens: 0
                });
            }

            return accumulator;
        }, []);

        return speakerTotals;
    },
    speakerTalkTotals: function() {
        var speakerTotals = this.initializeSpeakerTotals(),
            talkRatios = this.talkRatios();

        speakerTotals.forEach((speakerTotalObj, index, array) => {
            talkRatios.forEach((talkRatioObj, jindex, jarray) => {
                if (speakerTotalObj.speakerType === talkRatioObj.speakerType) {
                    if (!speakerTotalObj.hasOwnProperty("totalTalkPercentage")) {
                        speakerTotalObj.totalTalkPercentage = 0;
                    }

                    speakerTotalObj["totalTalkPercentage"] += talkRatioObj.percentage;
                }

            });
        });

        return speakerTotals;
    }
}
