import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LegendItemGroup from '../../legend/LegendItemGroup';
import TrendChartContainer from './TrendChartContainer';
// import calculateLessonDuration from '../../../utils/calculateLessonDuration';
// import legendLabels from '../../../fixtures/legend_labels';
// import formatPercentage from '../../../utils/formatPercentage';
import formatDate from '../../../utils/formatDate';
import removeArrayValue from '../../../utils/removeArrayValue';

class Overview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFilters: []
        };
    }

    // dateRange() {
    //     var teacherData = this.props.parserCollection.aggregatedParserRatios()["Teacher"];
    //     var start = teacherData[0].data[0].date;
    //     var end = teacherData[0].data[teacherData[0].data.length - 1].date;
    //
    //     var dateRange = {
    //         start: start,
    //         end: end
    //     };
    //     // console.log("dateRange", dateRange);
    //     return dateRange;
    // }

    // same logic as in Transcript::handleClick
    handleFilterClick(label) {
        var activeFilters = this.state.activeFilters;

        if (activeFilters.includes(label.value)) {
            activeFilters = removeArrayValue(label.value, activeFilters)
        } else {
            activeFilters.push(label.value);
        }

        this.setState({
            activeFilters: activeFilters
        });
        // console.log("this.state.activeFilters", this.state.activeFilters);
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
                {formatDate(this.props.datasets.parserCollection.dateRange().start)} - {formatDate(this.props.datasets.parserCollection.dateRange().end)} (Average duration: {this.props.datasets.parserCollection.averageDuration()})
              </h3>
            </div>
            <div className="even-columns-2">
              <div className="even-column">
                <h4 className="text-center">
                  Teacher
                </h4>
                <div className="overview-trend-chart-container">
                  <LegendItemGroup
                    labels={this.props.datasets.parserCollection.legendLabels({ type: "Teacher" })}
                    activeFilters={this.state.activeFilters}
                    displayRatio={false}
                    handleClick={this.handleFilterClick.bind(this)} />

                  <TrendChartContainer
                    data={this.props.datasets.parserCollection.aggregatedParserRatios()["Teacher"]}
                    activeFilters={this.state.activeFilters} />
                </div>
              </div>
              <div className="even-column">
                <h4 className="text-center">
                  Student
                </h4>
                <div className="overview-trend-chart-container">
                  <LegendItemGroup
                    labels={this.props.datasets.parserCollection.legendLabels({ type: "Student" })}
                    activeFilters={this.state.activeFilters}
                    displayRatio={false}
                    handleClick={this.handleFilterClick.bind(this)} />

                  <TrendChartContainer
                    data={this.props.datasets.parserCollection.aggregatedParserRatios()["Student"]}
                    activeFilters={this.state.activeFilters} />
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
