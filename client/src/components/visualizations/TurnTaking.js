import React, { Component } from 'react';
import PropTypes from "prop-types";

import Legend from '../legend/Legend';

import LegendLabels from '../../fixtures/legend_labels';
import data from '../../data/data';
import Script from './transcript/Script';

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
        this.parseChartData();
    }

    parseChartData() {
        let allData = [];

        for (const seg of data[0].data.segments) {
            if (seg.participation_type !== "Other") {
                const turn = seg.speaking_turns;

                for (const talk of turn) {
                    for (const utterance of talk.utterances) {
                        // categorize student and teacher talk for talk that has no utterance types
                        if (utterance.utterance_type.length > 0 &&
                            (utterance.utterance_type[0].includes("Teacher") ||
                                utterance.utterance_type[0].includes("Turn") ||
                                utterance.utterance_type[0].includes("Re-Voicing") ||
                                utterance.utterance_type[0].includes("Questions"))
                        ) {
                            allData.push({
                                content: utterance.utterance,
                                speaker: talk.speaker_pseudonym,
                                length: utterance.n_tokens,
                                types: utterance.utterance_type,
                                time: utterance.timestamp,
                                right: false,
                            });
                        } else if (utterance.utterance_type.length === 0) {
                            if (talk.speaker_pseudonym.includes("Class") ||
                                talk.speaker_pseudonym.includes("Student")) {
                                allData.push({
                                    content: utterance.utterance,
                                    speaker: talk.speaker_pseudonym,
                                    length: utterance.n_tokens,
                                    types: ["Assorted Student Talk"],
                                    time: utterance.timestamp,
                                    right: true,
                                });
                            } else if (talk.speaker_pseudonym.includes("Teacher")) {
                                allData.push({
                                    content: utterance.utterance,
                                    speaker: talk.speaker_pseudonym,
                                    length: utterance.n_tokens,
                                    types: ["Assorted Teacher Talk"],
                                    time: utterance.timestamp,
                                    right: false,
                                });
                            }
                        } else {
                            allData.push({
                                content: utterance.utterance,
                                speaker: talk.speaker_pseudonym,
                                length: utterance.n_tokens,
                                types: utterance.utterance_type,
                                time: utterance.timestamp,
                                right: true,
                            });
                        }
                    }
                }
            }
        }

        this.chartData = allData;
    }

    displayLegendLabels = function(options) {
        return LegendLabels.filter((item) => item.type === options.type);
    };

    render() {
        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-key-teacher">
                <Legend labels={this.displayLegendLabels({ type: "Teacher"})} />
                <Legend labels={this.displayLegendLabels({ type: "Technique" })} />
              </div>
              <div className="turn-taking-visualization">
                <div className="turn-taking-visualization-headings">
                  <h2>Teacher Talk</h2>
                  <h2>Student Talk</h2>
                </div>
                {this.chartData.map((item, index) => {
                    return (
                      <Bar key={index} data={item} />
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

function Bar(props) {
    var legendLabels = LegendLabels;
    var item = props.data;

    var timeStamp = item.time ? item.time : "";

    var isStudentData = item.speaker.includes("Student"),
        isTeacherData = item.speaker === "Teacher";

    var legendLabelValue = item.types[item.types.length - 1];
    var barColor = legendLabels.find(item => item.value === legendLabelValue).color;
    var barBorder = "";
    var boxSizing = "";
    if (item.types.length > 1) { // if it has multiple types, draw a border around the bar
        var borderValue = item.types && item.types[0];
        barBorder = `3px solid ${legendLabels.find(item => item.value === borderValue)}.color`;
        boxSizing = "border-box";
    }
    var barWidth = item.length * 6, // arbitrary multiplier
        barHeight = "14px";

    var baseStyle = { height: barHeight },
        extendedStyle = { backgroundColor: barColor, border: barBorder, boxSizing: boxSizing, width: barWidth, height: barHeight },
        teacherStyle = {},
        studentStyle = {};

    if (isTeacherData) {
        studentStyle = baseStyle;
        teacherStyle = { ...baseStyle, ...extendedStyle };
    }

    if (isStudentData) {
        studentStyle = { ...baseStyle, ...extendedStyle };
        teacherStyle = baseStyle;
    }

    return (
      <div>
        <div className="turn-taking-visualization-row">
          <div className="turn-taking-bar-timestamp">
            {timeStamp}
          </div>
          <div key={item.index} className="turn-taking-bar">
            <div className="turn-taking-bar-teacher-outer">
              <div className="turn-taking-bar-teacher-inner" style={teacherStyle}>
              </div>
            </div>
            <div className="turn-taking-bar-student-outer">
              <div className="turn-taking-bar-student-inner" style={studentStyle}>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="turn-taking-visualization-row-drilldown">
          <Script />
        </div>*/}
      </div>
    );
}

TurnTaking.propTypes = {
    chartData: PropTypes.array
};
