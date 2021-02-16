import { legendLabels, legendDict } from '../fixtures/legend_labels';

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
        // debugger;
        var duration;
        for (var i = this.utterances.length - 1; i > 0; i--) {
            var utteranceObj = this.utterances[i];
            if (utteranceObj.hasOwnProperty("timestamp") && utteranceObj.timestamp.length) {
                duration = utteranceObj.timestamp;
                break;
            }
        }

        this.duration = duration;
    }

    legendLabels = function(options) {
        var legendLabels = this.talkRatios().filter((item) => item.type === options.type);
        return legendLabels;
    }

    // {
    //   "id": "1",
    //   "speakerPseudonym": "Teacher",
    //   "timestamp": "0:00",
    //   "utterance": "-at least, this way, maybe. Maybe a little more... I'll entertain you with my teaching skills. What's that?",
    //   "utteranceCodes": [
    //     "OTT"
    //   ]
    // },
    transcript = function() {
        var transcript = this.utterances.map((utterance, index, array) => {
            // console.log("utterance.utterance", utterance);
            var speakerType = utterance.speakerPseudonym.includes("Student") ? "Student" : "Teacher";

            var nTokens = utterance.utterance.split(" ").length;

            // console.log("utterance.speakerPseudonym", utterance.speakerPseudonym, "utterance.utteranceCodes", utterance.utteranceCodes);
            var utteranceTypes = utterance.utteranceCodes.map((code) => {

                // console.log("code", code);
                return legendDict[speakerType][code];
            });
            // var utteranceTypes = utterance.utteranceCodes.reduce((prev, code, jindex, jarray) => {
            //     // console.log("jarray", jarray);
            //
            //
            //     var filteredLabels = legendLabels.filter((labelObj) => {
            //         // if (utterance.utteranceCodes.length === 2 && code === labelObj.code) {
            //         //     console.log("index", index, labelObj);
            //         // }
            //         if (index === 19 && code === labelObj.code) {
            //             // console.log("utterance", utterance, "code", code);
            //         }
            //         return code === labelObj.code;
            //     });
            //
            //     // if (index === 54) debugger;
            //     // if (!filteredLabels) {
            //     //     debugger;
            //     //     console.log('utterance', utterance);
            //     // }
            //     var filteredLabel = filteredLabels[0] && filteredLabels[0].value;
            //     // console.log("filteredLabels", filteredLabels, index, array.length);
            //     // console.log("filteredLabel", filteredLabel);
            //     prev.push(filteredLabel);
            //     return prev;
            //     // return filteredLabels.value;
            // }, []);

            // if (utterance.utteranceCodes.length === 2)
            //     console.log("utteranceTypes", utteranceTypes);

            return {
                ...utterance,
                speakerType: speakerType,
                nTokens: nTokens,
                utteranceTypes: utteranceTypes
            };
        });

        // console.log("transcript", transcript);
        return transcript;
    }

    filteredTranscript = function(options) {
        var data = this.transcript();
        var activeFilters = options && options.activeFilters;

        var filteredTranscript = data.reduce((accumulator, utterance, index, array) => {
            var shouldBeFiltered = activeFilters && activeFilters.some(filter => utterance.utteranceTypes.includes(filter));

            if (!shouldBeFiltered) {
                accumulator.push(utterance);
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
    // expandedData = function(options) {
    //     var activeFilters = options && options.activeFilters;
    //
    //     var transcript = this.filteredTranscript({ activeFilters: activeFilters });
    //
    //     return transcript.reduce((accumulator, turn, index, array) => {
    //         return accumulator.concat(turn.utterances);
    //     }, []);
    // }

    maxNTokens = function(options) {
        var activeFilters = options && options.activeFilters;

        var expandedData = this.filteredTranscript({ activeFilters: activeFilters });

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

    // parsedData = function(options) {
    //     var activeFilters = options && options.activeFilters;
    //     var expandedData = this.expandedData({ activeFilters: activeFilters }),
    //         collapsedData = this.collapsedData({ activeFilters: activeFilters });
    //
    //     var parsedData = {
    //         "expanded": expandedData,
    //         "collapsed": collapsedData
    //     };
    //
    //     return parsedData;
    // }

    nTokensPerUtteranceType = function() {
        var transcript = this.transcript(),
            talkRatios = legendLabels.map((labelObj, index, array) => { // set up object to be returned
                return {
                    ...labelObj,
                    nTokens: 0,
                    percentage: 0
                };
            });

        // console.log("talkRatios", talkRatios);

        // calculate nTokens for each utterance type
        talkRatios.forEach((labelObj, index, array) => {
            transcript.forEach((utterance, index, array) => {
                // console.log("utterance.utteranceTypes", utterance.utteranceTypes, "labelObj.value", labelObj.value)
                // debugger;
                if (utterance.speakerPseudonym.includes(labelObj.speakerType) && utterance.utteranceTypes.includes(labelObj.value)) {
                    labelObj.nTokens += utterance.nTokens;
                }
            });
        });

        // console.log("nTokensPerUtteranceType", talkRatios);
        return talkRatios;
    }

    talkRatios = function() {
        var nTokensPerUtteranceType = this.nTokensPerUtteranceType(),
            speakerTotals = this.initializeSpeakerTotals();

        // console.log("nTokensPerUtteranceType", nTokensPerUtteranceType);
        // console.log("speakerTotals", speakerTotals);

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

        // console.log("talkRatios", talkRatios);

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
