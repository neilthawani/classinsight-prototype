import React, { Component } from 'react';
import PropTypes from "prop-types";

import Labels from '../../fixtures/labels';
import Colors from '../../fixtures/colors';
import data from '../../data/data';

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

    transformLegendLabels = function(labelTextArray, options) {
        return labelTextArray.map((dispText) => {
            var label = {
                color: Colors[dispText]
            };

            dispText = dispText.replace("Teacher", "").trim();
            dispText = dispText.replace("Student", "").trim();
            dispText = dispText.replace("Questions", "").trim();
            dispText = dispText.replace("Assorted  Talk", "Other Talk");
            dispText = dispText.replace("Modeling", "").trim();
            dispText = dispText.replace("S/Q", "Questions");

            return { ...label, ...{ text: dispText } };
        });
    };
    teacherLegendLabels = Labels["Teacher"];
    studentLegendLabels = Labels["Student"];
    metaLegendLabels = Labels["Technique"];

    render() {
        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-key-teacher">
                <Legend labels={this.transformLegendLabels(this.teacherLegendLabels)} />
                <Legend labels={this.transformLegendLabels(this.metaLegendLabels)} />
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
                <Legend labels={this.transformLegendLabels(this.studentLegendLabels)} />
              </div>
            </div>
        );
    }
}

function Legend(props) {
    var labels = props.labels;

    return (
      <div>
      {labels.map((label, index) => {
        return (
          <div key={index} className="turn-taking-key-item">
            <div className="turn-taking-key-item-legend" style={{backgroundColor: label.color}}></div>
            <span className="turn-taking-key-item-text">
              {label.text}
            </span>
          </div>
        );
      })}
      </div>
    );
}

function Bar(props) {
    var item = props.data;

    var timeStamp = item.time ? item.time : "";

    var isStudentData = item.speaker.includes("Student"),
        isTeacherData = item.speaker === "Teacher";

    var barColor = Colors[item.types[item.types.length - 1]];
    var barBorder = "";
    var boxSizing = "";
    if (item.types.length > 1) {
        barBorder = `3px solid ${Colors[item.types[0]]}`;
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
    );
}

TurnTaking.propTypes = {
    chartData: PropTypes.array
};
