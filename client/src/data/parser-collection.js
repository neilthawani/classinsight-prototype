import LegendLabels from '../fixtures/legend_labels';
// import formatDate from '../utils/formatDate';
import formatPercentage from '../utils/formatPercentage';
import calculateLessonDuration from '../utils/calculateLessonDuration';

export default class ParserCollection {
    constructor(dataParsers) {
        this.dataParsers = dataParsers;
        // var parsedData = {};
        //
        // parsedData = JSON.parse(data.jsonData);
        // this.topic = data.classTopic;
        // this.period = data.classPeriod;
        // this.date = data.classDate;
        // this.data = parsedData;
        // this.segments = parsedData.segments;
        // this.isActive = false;
    }

    aggregatedParserRatios() {
        var dataParsers = this.dataParsers,//.reverse(),
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

                // console.log("prev", prev);
                return prev;
            }, {});
        // console.log("trendLineDataObj", trendLineDataObj);

        // dateArray is array of all dates
        var dateArray = Object.keys(trendLineDataObj);//,
        // console.log("dateArray", dateArray);
        // allTrendLines is array of labelObj's with an empty data array appended to each obj
        var allTrendLines = LegendLabels.map((labelObj) => {
            return {
                ...labelObj,
                data: []
            };
        });
        // console.log("allTrendLines", allTrendLines);

        dateArray.forEach((date, index, array) => {
            var dateLabelArray = trendLineDataObj[date];
            // console.log("dateLabelArray", dateLabelArray);

            var totalNTokens = dateLabelArray.reduce((prev, labelObj) => {
                prev += labelObj.nTokens;
                return prev;
            }, 0);
            // console.log("totalNTokens", totalNTokens);

            var trendLineDataArray = dateLabelArray.map((labelObj) => {
                return {
                    ...labelObj,
                    date: date,
                    percentageValue: labelObj.nTokens / totalNTokens,
                    formattedPercentageValue: formatPercentage(labelObj.nTokens / totalNTokens, 2, true, false),
                    percentageLabel: formatPercentage(labelObj.nTokens / totalNTokens, 0)//, true, false)
                };
            });
            // console.log("trendLineDataArray", trendLineDataArray);

            allTrendLines.forEach((trendLineDatum) => {
                var labelObjDatum = trendLineDataArray.filter((datum) => datum.value === trendLineDatum.value)[0];
                // debugger;
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
        var start = teacherData[0].data[0].date;
        var end = teacherData[0].data[teacherData[0].data.length - 1].date;

        var dateRange = {
            start: start,
            end: end
        };
        // console.log("dateRange", dateRange);
        return dateRange;
    }

    averageDuration() {
        var dataParsers = this.dataParsers,
            averageDurationInSecs = dataParsers.reduce((prev, parser) => {
                prev += parser.data.duration;
                return prev;
            }, 0) / dataParsers.length;

        return calculateLessonDuration(averageDurationInSecs);
    }

    legendLabels = function(options) {
        var legendLabels = LegendLabels.filter((item) => item.type === options.type);
        // console.log("legendLabels", legendLabels);
        return legendLabels;
    }
}
