import React, { Component } from 'react';
// import PropTypes from "prop-types";

import Labels from '../../fixtures/labels';
import Colors from '../../fixtures/colors';

import ArrowCollapseVerticalIcon from 'mdi-react/ArrowCollapseVerticalIcon';
import ArrowExpandVerticalIcon from 'mdi-react/ArrowExpandVerticalIcon';

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

        this.state = {
            bars: window.localStorage.getItem("bars") || "expanded"
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
                  <h2 className="turn-taking-visualization-heading">
                    Teacher Talk
                    {this.barsStateIcon[this.state.bars]}
                  </h2>

                  <h2 className="turn-taking-visualization-heading">
                    Student Talk
                  </h2>
                </div>
                <TurnTakingBars data={this.chartData(this.state.bars)} />
              </div>
              <div className="turn-taking-key-student">
                <Legend labels={this.transformLegendLabels(this.studentLegendLabels)} />
              </div>
            </div>
        );
    }
}

function TurnTakingBars(props) {
    var chartData = props.data || [];

    return chartData.map((item, index) => {
        return (
          <Bar key={index} data={item} />
        )
    })
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
    var barWidth = item.length,
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
