import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LegendItemGroup from '../legend/LegendItemGroup';
import TrendChartContainer from './TrendChartContainer';
import formatDate from '../../utils/formatDate';
import removeArrayValue from '../../utils/removeArrayValue';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFilters: []
        };
    }

    // TODO: same logic as in Transcript::handleClick
    handleFilterClick(label) {
        var activeFilters = this.state.activeFilters;

        var isFilterActive = activeFilters.some(filter => label.speakerType === filter.speakerType && label.code === filter.code);

        if (isFilterActive) {
            activeFilters = removeArrayValue(label, activeFilters)
        } else {
            activeFilters.push(label);
        }

        this.setState({
            activeFilters: activeFilters
        });
    }

    render() {
        if (!this.props.datasets.activeParser) {
            return (
              <div className="dashboard-container">
                <h2>Please upload data to use ClassInSight.</h2>
              </div>
            )
        }

        var parserCollection = this.props.datasets.parserCollection;

        if (parserCollection.dataParsers.length < 2) {
            return (
              <div className="dashboard-container">
                <h2>Please upload more than one data set to view aggregated data.</h2>
              </div>
            )
        }

        return (
          <div className="dashboard-container">
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
                {formatDate(parserCollection.dateRange().start)} - {formatDate(parserCollection.dateRange().end)} (Average duration: {parserCollection.averageDuration()})
              </h3>
            </div>
            <div className="even-columns-2">
              <div className="even-column">
                <h4 className="text-center">
                  Teacher
                </h4>
                <div className="overview-trend-chart-container">
                  <LegendItemGroup
                    labels={parserCollection.legendLabels({ type: "Teacher" })}
                    activeFilters={this.state.activeFilters}
                    displayRatio={false}
                    handleClick={this.handleFilterClick.bind(this)} />

                  <TrendChartContainer
                    data={parserCollection.aggregatedParserRatios()["Teacher"]}
                    activeFilters={this.state.activeFilters} />
                </div>
              </div>
              <div className="even-column">
                <h4 className="text-center">
                  Student
                </h4>
                <div className="overview-trend-chart-container">
                  <LegendItemGroup
                    labels={parserCollection.legendLabels({ type: "Student" })}
                    activeFilters={this.state.activeFilters}
                    displayRatio={false}
                    handleClick={this.handleFilterClick.bind(this)} />

                  <TrendChartContainer
                    data={parserCollection.aggregatedParserRatios()["Student"]}
                    activeFilters={this.state.activeFilters} />
                </div>
              </div>
            </div>
          </div>
        );
    }
}

Dashboard.propTypes = {
    datasets: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        datasets: state.datasets
    }
};

export default withRouter(connect(
  mapStateToProps,
  {}
)(Dashboard));
