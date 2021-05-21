import { legendLabels, legendDict } from '../fixtures/legend_labels';
import { utteranceMatchesLabel } from '../components/legend/labelFilters';

export default class Parser {
    constructor(data) {
        this.lessonName = data.lessonName;
        this.topic = data.classTopic;
        this.period = data.classPeriod;
        this.date = data.classDate;
        this.utterances = data.utterances;

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
        var legendLabels = this.talkRatios().filter((item) => item.speakerType === options.speakerType);
        return legendLabels;
    }

    transcript = function() {
        // console.log('this.utterances', this.utterances);
        var transcript = this.utterances.reduce((prev, utterance, index, array) => {
            if (utterance.isChat) {
                utterance['utterance'] = utterance.breakoutRoom;
            }

            // console.log('utterance', utterance);
            if (utterance.utteranceCodes.includes("OT")) {
                return prev;
            }

            var speakerType = (utterance.speakerPseudonym.includes("Student") || utterance.speakerPseudonym.includes("students")) ? "Student" : "Teacher";
            // console.log('utterance.utterance', utterance.utterance);
            var nTokens = utterance.utterance.split(" ").length;

            // console.log('utterance', utterance);
            var utteranceTypes = utterance.utteranceCodes.map((code) => {
                // console.log('code', code);

                // NOTE: Keep this code. It's one of the most common errors.
                // console.log('legendDict[speakerType]', legendDict[speakerType]);
                // console.log('legendDict[speakerType][code]', legendDict[speakerType][code]);
                if (!legendDict[speakerType][code]) {
                  console.log('utterance', utterance);
                  debugger;
                }
                // console.log('legendDict[speakerType][code].value', legendDict[speakerType][code].value);
                // console.log("legendDict[speakerType][code]", legendDict[speakerType][code], 'speakerType', speakerType, 'code', code);
                return legendDict[speakerType][code].value;
            });

            prev.push({
                ...utterance,
                speakerType: speakerType,
                nTokens: nTokens,
                utteranceTypes: utteranceTypes
            });

            return prev;
        }, []);

        return transcript;
    }

    filteredTranscript = function(options) {
        var data = this.transcript();
        var activeFilters = options && options.activeFilters;

        var filteredTranscript = data.reduce((accumulator, utterance, index, array) => {
            var shouldBeFiltered = activeFilters && activeFilters.some(filter => utterance.speakerType === filter.speakerType && utterance.utteranceCodes.includes(filter.code));

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

        var drilldownTranscript = data.reduce((accumulator, utterance, index, array) => {
            if (utterance.speakerType === drilldownFilter.speakerType && utterance.utteranceCodes.includes(drilldownFilter.code)) {
                accumulator.push(utterance);
            }

            return accumulator;
        }, []);

        return drilldownTranscript;
    }

    maxNTokens = function(options) {
        var activeFilters = options && options.activeFilters;

        var expandedData = this.filteredTranscript({ activeFilters: activeFilters });

        const maxTokens = expandedData.reduce((prev, utterance) => {
          // debugger;
            if (utterance.nTokens > prev[utterance.speakerType]) {
                prev[utterance.speakerType] = utterance.nTokens;
            }

            return prev;
        }, {
          'Student': 0,
          'Teacher': 0
        });

        // console.log('tokens', tokens);
        // return Math.max.apply(Math, expandedData.map((utterance) => utterance.nTokens));
        console.log('maxTokens', maxTokens);
        return maxTokens['Student'] + maxTokens['Teacher'];
        // return 400;
    }

    nTokensPerUtteranceType = function() {
        var transcript = this.transcript(),
            talkRatios = legendLabels.map((labelObj, index, array) => { // set up object to be returned
                return {
                    ...labelObj,
                    nTokens: 0,
                    percentage: 0
                };
            });

        // calculate nTokens for each utterance type
        talkRatios.forEach((labelObj, index, array) => {
            transcript.forEach((utterance, index, array) => {
                if (utteranceMatchesLabel(utterance, labelObj)) {
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
            teacherTalkRatios = talkRatios.filter((item) => item.speakerType === "Teacher").reverse();

        return teacherTalkRatios;
    }

    studentTalkRatios = function() {
        var talkRatios = this.talkRatios(),
            studentTalkRatios = talkRatios.filter((item) => item.speakerType === "Student");

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
