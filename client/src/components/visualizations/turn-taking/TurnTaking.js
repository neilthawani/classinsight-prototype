import React, { Component } from 'react';
// import PropTypes from "prop-types";

import ArrowCollapseVerticalIcon from 'mdi-react/ArrowCollapseVerticalIcon';
import ArrowExpandVerticalIcon from 'mdi-react/ArrowExpandVerticalIcon';

import Legend from '../../legend/Legend';
import LegendLabels from '../../../fixtures/legend_labels';
import Bar from './Bar';

import data from '../../../data/data';

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
            bars: window.localStorage.getItem("bars") || "expanded",
            focusText: null
        };
    }

    toggleExpandedBars = function(value, context) {
        this.setState({ "bars": value });
        window.localStorage.setItem("bars", value);
    }

    // https://stackoverflow.com/questions/46424589/toggle-component-in-react-on-button-click
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

    chartData = function(status) {
        switch (status) {
            case "expanded": return this.expandedData;
            case "collapsed": return this.collapsedData;
            default: return [];
        }
    }

    collapsedData = data[0].data.segments.reduce((allData, seg, index, array) => {
        if (seg.participation_type !== "Other") {
            const turn = seg.speaking_turns;

            for (const talk of turn) {
                for (const utterance of talk.utterances) {
                    var unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                            (talk.speaker_pseudonym.includes("Class") ||
                            talk.speaker_pseudonym.includes("Student")),
                        unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                            talk.speaker_pseudonym.includes("Teacher"),
                        dataRow = {
                            content: utterance.utterance,
                            speaker: talk.speaker_pseudonym,
                            length: utterance.n_tokens,
                            time: utterance.timestamp
                        };

                    // categorize student and teacher talk for talk that has no utterance types
                    if (unclassifiedStudentTalk) {
                        dataRow = { ...dataRow, ...{ types: ["Assorted Student Talk"] } };
                    } else if (unclassifiedTeacherTalk) {
                        dataRow = { ...dataRow, ...{ types: ["Assorted Teacher Talk"] } };
                    } else {
                        dataRow = { ...dataRow, ...{ types: utterance.utterance_type } };
                    }

                    if (allData.length === 0) {
                        allData.push(dataRow);
                    } else {
                        var previousDataRow = allData[allData.length - 1],
                            sameUtteranceTypesAsPrevious = JSON.stringify(previousDataRow.types) === JSON.stringify(dataRow.types);

                        if (sameUtteranceTypesAsPrevious) {
                            previousDataRow.length += dataRow.length;
                            previousDataRow.time = dataRow.time;
                        } else {
                            allData.push(dataRow);
                        }
                    }
                }
            }
        }

        return allData;
    }, []);

    expandedData = data[0].data.segments.reduce((allData, seg, index, array) => {
        if (seg.participation_type !== "Other") {
            const turn = seg.speaking_turns;

            for (const talk of turn) {
                for (const utterance of talk.utterances) {
                    var unclassifiedStudentTalk = utterance.utterance_type.length === 0 &&
                            (talk.speaker_pseudonym.includes("Class") ||
                            talk.speaker_pseudonym.includes("Student")),
                        unclassifiedTeacherTalk = utterance.utterance_type.length === 0 &&
                            talk.speaker_pseudonym.includes("Teacher"),
                        dataRow = {
                            content: utterance.utterance,
                            speaker: talk.speaker_pseudonym,
                            length: utterance.n_tokens,
                            time: utterance.timestamp
                        };

                    if (unclassifiedStudentTalk) {
                        dataRow = { ...dataRow, ...{ types: ["Assorted Student Talk"] } };
                    } else if (unclassifiedTeacherTalk) {
                        dataRow = { ...dataRow, ...{ types: ["Assorted Teacher Talk"] } };
                    } else {
                        dataRow = { ...dataRow, ...{ types: utterance.utterance_type } };
                    }

                    allData.push(dataRow);
                }
            }
        }

        return allData;
    }, []);

    displayLegendLabels = function(options) {
        return LegendLabels.filter((item) => item.type === options.type);
    };

    render() {
        var chartData = this.chartData(this.state.bars);

        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-key-teacher">
                <Legend labels={this.displayLegendLabels({ type: "Teacher"})} />
                <Legend labels={this.displayLegendLabels({ type: "Technique" })} />
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
                      <Bar key={index} data={item} focusText={this.state.focusText} />
                    )
                })}
              </div>
              <div className="turn-taking-key-student">
                <Legend labels={this.displayLegendLabels({ type: "Student" })} />
              </div>
            </div>
        );
    }
}
