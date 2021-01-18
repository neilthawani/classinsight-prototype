import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LegendItemGroup from '../../legend/LegendItemGroup';
import TrendChart from './TrendChart';
import calculateLessonDuration from '../../../utils/calculateLessonDuration';
import legendLabels from '../../../fixtures/legend_labels';

class Overview extends Component {
    aggregatedParserRatios() {
        var dataParsers = this.props.datasets.dataParsers,
            // trendLineDataObj is of the format: { date: labelObj, date: labelObj, etc. }
            trendLineDataObj = dataParsers.reduce((prev, parser, index, array) => {
                // if (parser.date !== "2020-01-23") return prev;
                var labelObj = parser.nTokensPerUtteranceType();

                // if there is only one data row from a date
                if (!prev.hasOwnProperty(parser.date)) {
                    // console.log("doesn't exist");
                    prev[parser.date] = labelObj;
                } else { // otherwise if there are multiple data rows with the same date
                    // console.log("exists already");
                    var existingData = prev[parser.date];

                    existingData.forEach((existingLabelObj, index) => {
                        // console.log("adding", existingLabelObj);
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
        var allTrendLines = legendLabels.map((labelObj) => {
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
                    percentage: labelObj.nTokens / totalNTokens
                };
            });
            // console.log("trendLineDataArray", trendLineDataArray);

            allTrendLines.forEach((trendLineDatum) => {
                var labelObjDatum = trendLineDataArray.filter((datum) => datum.value === trendLineDatum.value)[0];
                // debugger;
                trendLineDatum.data.push({
                    date: labelObjDatum.date,
                    nTokens: labelObjDatum.nTokens,
                    percentage: labelObjDatum.percentage
                    // ...labelObjDatum
                    // date: trendLineDataArray.
                });
            });

            // console.log("")
            // debugger;
        });

        return {
            Teacher: allTrendLines.filter((legendLabelObj => legendLabelObj.type === "Teacher")),
            Student: allTrendLines.filter((legendLabelObj => legendLabelObj.type === "Student"))
        };

        // console.log("allTrendLines", allTrendLines);
        // console.log("dataParsers", dataParsers);
        // console.log("talkRatios", talkRatios);
        // console.log("trendLineData", trendLineDataArray);
        // console.log(dataParsers[0].nTokensPerUtteranceType());
        // return allTrendLines;
    }

    averageDuration() {
        var dataParsers = this.props.datasets.dataParsers,
            averageDurationInSecs = dataParsers.reduce((prev, parser) => {
                prev += parser.data.duration;
                return prev;
            }, 0) / dataParsers.length;

        return calculateLessonDuration(averageDurationInSecs);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var parser = this.props.datasets.activeParser;

        // console.log("aggregated data", this.aggregatedParserRatios());

        return (
          <div className="overview-container">
            <div className="overview-heading">
              <h3 className="overview-heading-label">
                Overview
              </h3>
              <select className="overview-heading-dropdown">
                <option>all time</option>
                <option>this month</option>
                <option>this week</option>
              </select>
              <h3 className="overview-heading-label">
                startDate - endDate (Average duration: {this.averageDuration()})
              </h3>
            </div>
            <div className="even-columns-2">
              <div className="even-column">
                <h4 className="text-center">
                  Teacher
                </h4>
                <div className="overview-trend-chart-container">
                  <LegendItemGroup
                    labels={parser.legendLabels({ type: "Teacher" })}
                    displayRatio={false}
                    handleClick={() => {}} />

                  {/*<TrendChart
                    data={this.aggregatedParserRatios()["Teacher"]}/>*/}
                </div>
              </div>
              <div className="even-column">
                <h4 className="text-center">
                  Student
                </h4>
                <div className="overview-trend-chart-container">
                  <LegendItemGroup
                    labels={parser.legendLabels({ type: "Student" })}
                    displayRatio={false}
                    handleClick={() => {}} />

                  {/*<TrendChart
                    data={this.aggregatedParserRatios()["Student"]}/>*/}
                </div>
              </div>
            </div>
          </div>
        );
    }
}

Overview.propTypes = {
    datasets: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  {}
)(Overview));
