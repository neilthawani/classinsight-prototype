import React, { Component } from 'react';

import Parser from '../../../data/parser';

import Bar from './Bar';
import LegendItemGroup from '../../legend/LegendItemGroup';
import displayLegendLabels from '../../legend/displayLegendLabels';

import ArrowCollapseVerticalIcon from 'mdi-react/ArrowCollapseVerticalIcon';
import ArrowExpandVerticalIcon from 'mdi-react/ArrowExpandVerticalIcon';

import removeArrayValue from '../../../utils/removeArrayValue';
import isObjectEmpty from '../../../utils/isObjectEmpty';

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

export default class TurnTaking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bars: localStorage.getItem("bars") || "expanded",
            focusObj: {},
            activeFilters: []
        };
    }

    toggleExpandedBars = function(value, context) {
        this.setState({ "bars": value });
        localStorage.setItem("bars", value);
    }

    barsStateIcon = {
        "expanded": <ArrowCollapseVerticalIcon
          className="turn-taking-visualization-heading-icon"
          onClick={this.toggleExpandedBars.bind(this, "collapsed")}
          size="24" />,
        "collapsed": <ArrowExpandVerticalIcon
          className="turn-taking-visualization-heading-icon"
          onClick={this.toggleExpandedBars.bind(this, "expanded")}
          size="24" />
    }

    handleExpandClick(evt, rowObj) {
        var focusObj = this.state.focusObj;

        if (!isObjectEmpty(focusObj) && rowObj.id === focusObj.id && rowObj.utterance === focusObj.utterance) {
            this.setState({focusObj: {}});
        } else {
            this.setState({focusObj: rowObj});
        }
    }

    // clean up this from Transcript too
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

    render() {
        var chartData = Parser.parsedData({activeFilters: this.state.activeFilters})[this.state.bars];

        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-legend-teacher">
                <LegendItemGroup
                  labels={displayLegendLabels({ type: "Teacher"})}
                  handleClick={this.handleFilterClick.bind(this) }/>
                <LegendItemGroup
                  labels={displayLegendLabels({ type: "Technique"})}
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
                        activeFilters={this.state.activeFilters}
                        focusObj={this.state.focusObj}
                        onRowClick={this.handleExpandClick.bind(this)} />
                    )
                })}
              </div>
              <div className="turn-taking-legend-student">
                <LegendItemGroup
                  labels={displayLegendLabels({ type: "Student" })}
                  handleClick={this.handleFilterClick.bind(this) }/>
              </div>
            </div>
        );
    }
}
