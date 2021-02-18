import React, { Component } from 'react';
import Bar from './Bar';
import LegendItemGroup from '../../legend/LegendItemGroup';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { changeActiveFilters } from '../../legend/labelFilters';

class TurnTaking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFilters: [],
            activeTurn: {}
        };
    }

    handleFilterClick(label) {
        this.setState({
            activeFilters: changeActiveFilters(this.state.activeFilters, label)
        });
    }

    handleBarClick(value) {
        if (value.id === this.state.activeTurn.id) {
            value = {};
        }

        this.setState({
            activeTurn: value
        });
    }

    handleTextClick(turnId) {
        var slashTurnTaking = this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf("/"));
        var newPathname = this.props.location.pathname.replace(slashTurnTaking, `/transcript#${turnId}`);
        this.props.history.push(newPathname);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var parser = this.props.datasets.activeParser,
            chartData = parser.filteredTranscript({activeFilters: this.state.activeFilters}) || [];

        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-legend-teacher">
                <LegendItemGroup
                  labels={parser.legendLabels({ speakerType: "Teacher"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>
              </div>
              <div className="turn-taking-visualization">
                <div className="turn-taking-visualization-headings">
                  <h2 className="turn-taking-visualization-heading">
                    Teacher Talk
                  </h2>

                  <h2 className="turn-taking-visualization-heading">
                    Student Talk
                  </h2>
                </div>
                {chartData.map((item, index) => {
                    return (
                      <Bar
                        key={index}
                        data={item}
                        handleBarClick={this.handleBarClick.bind(this)}
                        handleTextClick={this.handleTextClick.bind(this)}
                        activeTurn={this.state.activeTurn} />
                    )
                })}
              </div>
              <div className="turn-taking-legend-student">
                <LegendItemGroup
                  labels={parser.legendLabels({ speakerType: "Student"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>
              </div>
            </div>
        );
    }
}


TurnTaking.propTypes = {
    datasets: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { }
)(TurnTaking));
