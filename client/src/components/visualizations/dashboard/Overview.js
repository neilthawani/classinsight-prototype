import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LegendItemGroup from '../../legend/LegendItemGroup';
import TrendChart from './TrendChart';

class Overview extends Component {
    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var parser = this.props.datasets.activeParser;

        return (
          <div className="overview-container">
            <div className="overview-heading">
              <h3 className="overview-heading-label">
                Overview
              </h3>
              <select className="overview-heading-dropdown">
                <option>this lesson</option>
                <option>today</option>
                <option>this week</option>
                <option>this month</option>
              </select>
              <h3 className="overview-heading-label">
                startDate - endDate
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
                  <div className="overview-trend-chart">
                    <TrendChart />
                  </div>
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
                  <div className="overview-trend-chart">
                    <TrendChart />
                  </div>
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
