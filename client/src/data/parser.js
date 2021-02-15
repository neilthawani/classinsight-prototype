import LegendLabels from '../fixtures/legend_labels';

export default class Parser {
    constructor(data) {
        // var parsedData = {};

        // console.log("data", data);
        // debugger;

        // parsedData = JSON.parse(data.jsonData);
        this.topic = data.classTopic;
        this.period = data.classPeriod;
        this.date = data.classDate;
        // this.data = parsedData;
        // debugger;
        this.utterances = data.utterances;//parsedData.segments;
        this.isActive = false;
    }

    legendLabels = function(options) {
        var legendLabels = this.talkRatios().filter((item) => item.type === options.type);
        return legendLabels;
    }

    transcript = function() {
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
                                !speakingTurn.speaker_pseudonym.includes("Student") && !speakingTurn.speaker_pseudonym.includes("Class") && !speakingTurn.speaker_pseudonym.includes("Video"),
                            videoTeacherTalk = speakingTurn.speaker_pseudonym.includes("Video"),
                            speakerPseudonym = speakingTurn.speaker_pseudonym.includes("Video") ? "Teacher (Video)" : speakingTurn.speaker_pseudonym,
                            dataRow = {
                                id: utteranceIndex++,
                                timestamp: [],
                                speakerPseudonym: speakerPseudonym,
                                speakerUtterances: [utterance.utterance],
                                nTokens: utterance.n_tokens
                            };

                        if (utterance.timestamp.length) {
                            dataRow.timestamp.push(utterance.timestamp);
                        }

                        if (unclassifiedStudentTalk) {
                            dataRow = { ...dataRow, ...{ utteranceTypes: ["Assorted Student Talk"] } };
                        } else if (unclassifiedTeacherTalk) {
                            dataRow = { ...dataRow, ...{ utteranceTypes: ["Assorted Teacher Talk"] } };
                        } else if (videoTeacherTalk) {
                            dataRow = { ...dataRow, ...{ utteranceTypes: ["Video"] } };
                        } else {
                            dataRow = { ...dataRow, ...{ utteranceTypes: utterance.utterance_type } };
                        }

                        transcript[transcript.length - 1].utterances.push(dataRow);
                    });
                });
            }
        });

        console.log("transcript", transcript);
        return transcript;
    }

    filteredTranscript = function(options) {
        var data = this.transcript();
        var activeFilters = options && options.activeFilters;

        var filteredTranscript = data.reduce((accumulator, turn, index, array) => {
            var newUtterances = turn.utterances.reduce((jaccumulator, utterance, jindex, jarray) => {
                var shouldBeFiltered = activeFilters && activeFilters.some(filter => utterance.utteranceTypes.includes(filter));

                if (!shouldBeFiltered) {
                    jaccumulator.push(utterance);
                }

                return jaccumulator;
            }, []);

            if (newUtterances.length) {
                turn.utterances = newUtterances;
                accumulator.push(turn);
            }

            return accumulator;
        }, []);

        return filteredTranscript;
    }

    // used in TalkRatio to accumulate utterance types, divided by turn
    drilldownTranscript = function(options) {
        var data = this.transcript(),
            drilldownFilter = options && options.drilldownFilter;

        var drilldownTranscript = data.reduce((accumulator, turn, index, array) => {
            var newUtterances = turn.utterances.reduce((jaccumulator, utterance, jindex, jarray) => {
                if (utterance.utteranceTypes.includes(drilldownFilter)) {
                    jaccumulator.push(utterance);
                }

                return jaccumulator;
            }, []);

            if (newUtterances.length) {
                turn.utterances = newUtterances;
                accumulator.push(turn);
            }

            return accumulator;
        }, []);

        return drilldownTranscript;
    }

    // used in TurnTaking but only called here
    expandedData = function(options) {
        var activeFilters = options && options.activeFilters;

        var transcript = this.filteredTranscript({ activeFilters: activeFilters });

        return transcript.reduce((accumulator, turn, index, array) => {
            return accumulator.concat(turn.utterances);
        }, []);
    }

    maxNTokens = function(options) {
        var activeFilters = options && options.activeFilters;

        var expandedData = this.expandedData({ activeFilters: activeFilters });

        return Math.max.apply(Math, expandedData.map((utterance) => utterance.nTokens));
    }
    collapsedData = function(options) {
        var activeFilters = options && options.activeFilters;
        var expandedData = this.expandedData({ activeFilters: activeFilters }),
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
                collapsedData[collapsedData.length - 1].speakerUtterances.push(...dataRow.speakerUtterances);
            }

            if (collapsedData.length === 0 || (collapsedData.length > 0 && !sameUtteranceTypesAsPrevious)) {
                collapsedData.push(dataRow);
            }
        });

        return collapsedData;
    }

    parsedData = function(options) {
        var activeFilters = options && options.activeFilters;
        var expandedData = this.expandedData({ activeFilters: activeFilters }),
            collapsedData = this.collapsedData({ activeFilters: activeFilters });

        var parsedData = {
            "expanded": expandedData,
            "collapsed": collapsedData
        };

        return parsedData;
    }

    nTokensPerUtteranceType = function() {
        var expandedData = this.expandedData(), // get array of every utterance in the transcript
            legendLabels = LegendLabels,
            talkRatios = legendLabels.map((labelObj, index, array) => { // set up object to be returned
                return {
                    ...labelObj,
                    ...{ nTokens: 0, percentage: 0 }
                };
            });

        // calculate nTokens for each utterance type
        talkRatios.forEach((labelObj, index, array) => {
            expandedData.forEach((utterance, index, array) => {
                if (utterance.utteranceTypes.includes(labelObj.value)) {
                    labelObj.nTokens += utterance.nTokens;
                }
            });
        });

        return talkRatios;
    }

    talkRatios = function() {
        var nTokensPerUtteranceType = this.nTokensPerUtteranceType(),
            speakerTotals = this.initializeSpeakerTotals();

        // populate the initialized speakerTotals object
        // by calculating totalNTokens for each speakerType
        speakerTotals.forEach((totalObj, index, array) => {
            totalObj.totalNTokens = nTokensPerUtteranceType
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

        nTokensPerUtteranceType.forEach((ratioObj, index, array) => {
            ratioObj.percentage = ratioObj.nTokens / allSpeakersTotalNTokens;
        });

        return nTokensPerUtteranceType;
    }

    teacherTalkRatios = function() {
        var talkRatios = this.talkRatios(),
            teacherTalkRatios = talkRatios.filter((item) => item.type === "Teacher").reverse();

        return teacherTalkRatios;
    }

    studentTalkRatios = function() {
        var talkRatios = this.talkRatios(),
            studentTalkRatios = talkRatios.filter((item) => item.type === "Student");

        return studentTalkRatios;
    }

    // only called in this file by speakerTalkTotals
    initializeSpeakerTotals = function() {
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
    }

    // headings on TalkRatio: Teacher Talk (%), Student Talk (%)
    speakerTalkTotals = function() {
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
