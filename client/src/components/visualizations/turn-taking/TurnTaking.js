import React, { Component } from 'react';
import Bar from './Bar';
import LegendItemGroup from '../../legend/LegendItemGroup';

import Icon from '@mdi/react';
import { mdiArrowCollapseVertical, mdiArrowExpandVertical } from '@mdi/js';

import removeArrayValue from '../../../utils/removeArrayValue';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
/*
For this file, the data we're after is in data.segments[0].speaking_turns.
Each object in this array is a record of someone speaking. It has this structure:
{
    duration: 0
    end_time: "[00:00:00;23]",
​​​​    initial_time: "[00:00:00;23]",
    speaker_pseudonym: "Teacher",
    tokens_per_second: 0,
​​​​​    total_tokens: 108,
​​​​​    utterances: [],
}

Utterances is an array of objects that contain information about what was said.
Each object in the array has this structure:
{
    line_number: "8",
​​​​​​​    n_tokens: 14,
​​​​​​​​    timestamp: "",
​​​​​​​​    utterance: "Ok, so what is it that you though- ...",
    utterance_type: [ " Teachers  Open-Ended  Statements/Question (S/Q)" ]
}
*/

class TurnTaking extends Component {
    constructor(props) {
        super(props);

        var bars = localStorage.getItem("bars") || "expanded",
            activeFilters = [];

        this.state = {
            bars: bars,
            activeFilters: activeFilters,
            activeTurn: {}
        };
    }

    toggleExpandedBars = function(value, context) {
        this.setState({ "bars": value });
        localStorage.setItem("bars", value);
    }

    barsStateIcon = {
        "expanded": <Icon
          path={mdiArrowCollapseVertical}
          className="turn-taking-visualization-heading-icon"
          onClick={this.toggleExpandedBars.bind(this, "collapsed")}
          size={1} />,
        "collapsed": <Icon
          path={mdiArrowExpandVertical}
          className="turn-taking-visualization-heading-icon"
          onClick={this.toggleExpandedBars.bind(this, "expanded")}
          size={1} />
    }

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
            chartData = parser.parsedData({activeFilters: this.state.activeFilters})[this.state.bars] || [];

        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-legend-teacher">
                <LegendItemGroup
                  labels={parser.legendLabels({ type: "Teacher"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>
                <LegendItemGroup
                  labels={parser.legendLabels({ type: "Technique"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>
              </div>
              <div className="turn-taking-visualization">
                <div className="turn-taking-visualization-headings">
                  <h2 className="turn-taking-visualization-heading">
                    Teacher Talk
                    {this.barsStateIcon[this.state.bars]}
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
                  labels={parser.legendLabels({ type: "Student"})}
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
