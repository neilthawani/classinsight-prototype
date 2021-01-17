import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LegendItemGroup from '../../legend/LegendItemGroup';
import TrendChart from './TrendChart';
import calculateLessonDuration from '../../../utils/calculateLessonDuration';

class Overview extends Component {
    aggregatedParserRatios() {
        var dataParsers = this.props.datasets.dataParsers,
            talkRatios = dataParsers.reduce((prev, parser, index, array) => {
                debugger;
                prev.push(parser.talkRatios());
                return prev;
            }, []);
        console.log("dataParsers", dataParsers);
        console.log("talkRatios", talkRatios);
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

        console.log("aggregated data", this.aggregatedParserRatios());

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

                  {/*<TrendChart />*/}
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

                  {/*<TrendChart />*/}
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
