import { legendLabels } from '../fixtures/legend_labels';
import formatPercentage from '../utils/formatPercentage';
import { convertTimestampToSeconds, calculateLessonDuration } from '../utils/calculateLessonDuration';

export default class ParserCollection {
    constructor(dataParsers) {
        this.dataParsers = dataParsers;
    }

    // used for Dashboard trend lines
    aggregatedParserRatios() {
        var dataParsers = this.dataParsers,
            // trendLineDataObj is of the format: { date: labelObj, date: labelObj, etc. }
            trendLineDataObj = dataParsers.reduce((prev, parser, index, array) => {
                var labelObj = parser.nTokensPerUtteranceType();

                // if there is only one data row from a date
                if (!prev.hasOwnProperty(parser.date)) {
                    prev[parser.date] = labelObj;
                } else { // otherwise if there are multiple data rows with the same date
                    var existingData = prev[parser.date];

                    existingData.forEach((existingLabelObj, index) => {
                        existingLabelObj.nTokens += labelObj[index].nTokens;
                    });
                }

                return prev;
            }, {});

        // dateArray is array of all dates
        var dateArray = Object.keys(trendLineDataObj);

        // allTrendLines is array of labelObj's with an empty data array appended to each obj
        var allTrendLines = legendLabels.map((labelObj) => {
            return {
                ...labelObj,
                data: []
            };
        });

        dateArray.forEach((date, index, array) => {
            var dateLabelArray = trendLineDataObj[date];

            var totalNTokens = dateLabelArray.reduce((prev, labelObj) => {
                prev += labelObj.nTokens;
                return prev;
            }, 0);

            var trendLineDataArray = dateLabelArray.map((labelObj) => {
                return {
                    ...labelObj,
                    date: date,
                    percentageValue: labelObj.nTokens / totalNTokens,
                    formattedPercentageValue: formatPercentage(labelObj.nTokens / totalNTokens, 2, true, false),
                    percentageLabel: formatPercentage(labelObj.nTokens / totalNTokens, 0)
                };
            });

            allTrendLines.forEach((trendLineDatum) => {
                var labelObjDatum = trendLineDataArray.filter((datum) => datum.value === trendLineDatum.value)[0];

                trendLineDatum.data.push({
                    date: labelObjDatum.date,
                    nTokens: labelObjDatum.nTokens,
                    percentageValue: labelObjDatum.percentageValue,
                    formattedPercentageValue: labelObjDatum.formattedPercentageValue,
                    percentageLabel: labelObjDatum.percentageLabel
                });
            });
        });

        return {
            Teacher: allTrendLines.filter((legendLabelObj => legendLabelObj.type === "Teacher")),
            Student: allTrendLines.filter((legendLabelObj => legendLabelObj.type === "Student"))
        };
    }

    dateRange() {
        var teacherData = this.aggregatedParserRatios()["Teacher"];

        // Developer's note: Sidebar classes display in descending order by default.
        // See datasetReducer::LIST_DATASETS::sortedPayload
        var end = teacherData[0].data[0].date;
        var start = teacherData[0].data[teacherData[0].data.length - 1].date;

        var dateRange = {
            start: start,
            end: end
        };

        return dateRange;
    }

    // average lesson duration
    averageDuration() {
        // return "";
        var dataParsers = this.dataParsers,
            averageDurationInSecs = dataParsers.reduce((prev, parser) => {
                prev += convertTimestampToSeconds(parser.duration);
                return prev;
            }, 0) / dataParsers.length;

        return calculateLessonDuration(averageDurationInSecs);
    }

    // aggregated legend labels
    // options.type is either Teacher or Student
    legendLabels = function(options) {
        return legendLabels.filter((item) => item.type === options.type);
    }
}
