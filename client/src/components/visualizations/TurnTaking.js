import React, { Component } from 'react';
import PropTypes from "prop-types";

import Colors from '../../fixtures/colors';
import data from '../../data/data';

// for this file, the data we're after is in data.segments[0].speaking_turns.
// Each object in this array is a record of someone speaking. It has this
// structure:
/*
{
    duration: 0
    end_time: "[00:00:00;23]",
​​​​    initial_time: "[00:00:00;23]",
    speaker_pseudonym: "Teacher",
    tokens_per_second: 0,
​​​​​    total_tokens: 108,
​​​​​    utterances: [],
},
​​​​​*/

// Utterances is an array of objects that contain information about what
// was said. Each object in the array has this structure:
/*
    line_number: "8",
​​​​​​​    n_tokens: 14,
​​​​​​​​    timestamp: "",
​​​​​​​​    utterance: "Ok, so what is it that you though- ...",
    utterance_type: [ " Teachers  Open-Ended  Statements/Question (S/Q)" ]
*/

// const h = 10;
// const multiplier = 6;
// const strokeW = 2;
//
//
//
// function draw() {
//
//     p.strokeWeight(strokeW);
//
//     const center = canvas.width / 2;
//     let y = 60;
//
//     const getUpperCorner = (yPos, right, length) => {
//         if (right) return { x: center + strokeW, y: yPos };
//         else return { x: center - length - strokeW, y: yPos };
//     };
//
//     // draw the graphs
//     for (const data of allData) {
//         let length = multiplier * data.length;
//         const pos = getUpperCorner(y, data.right, length);
//         p.fill(Colors[data.types[0]]);
//         if (data.types.length > 1) {
//             p.fill(Colors[data.types[1]]);
//             p.stroke(Colors[data.types[0]]);
//         } else {
//             p.stroke(Colors[data.types[0]]);
//         }
//         p.rect(pos.x, pos.y, length, h);
//
//         // draw timestamp
//         p.noStroke();
//         p.fill(10);
//         p.textSize(12);
//         p.text(data.time, center + 200, pos.y + 12);
//
//         y += h + strokeW * 2;
//     }
//
//     drawLegend(150, p, canvas);
//
//     // label side
//     let rightX = center + 100;
//     let leftX = center - 200;
//     p.textSize(18);
//     p.textAlign(p.CENTER, p.CENTER);
//     p.text("Teacher Talk", leftX, 30);
//     p.text("Student Talk", rightX, 30);
// }

export default class TurnTaking extends Component {
    constructor(props) {
        super(props);
        this.drawChart();
        // debugger;
    }

    // drawLegend(height, p, canvas) {
    //     // const h = 22;
    //     const numTeacher = 8;
    //     const numModifiers = 3;
    //     // let y = height;
    //     p.textSize(12);
    //     p.noStroke();
    //     let iter = 0;
    //     for (const key in Colors) {
    //         let fillColor = Colors[key];
    //         p.fill(fillColor);
    //
    //         let dispText = key;
    //         dispText = dispText.replace("Teacher", "");
    //         dispText = dispText.replace("Student", "");
    //         dispText = dispText.replace("Questions", "");
    //         dispText = dispText.replace("Assorted  Talk", "Other talk");
    //         dispText = dispText.replace("Modeling", "");
    //         dispText = dispText.replace("S/Q", "Questions");
    //
    //         // draw legends
    //         if (iter < numTeacher) {
    //             if (iter >= numTeacher - numModifiers) {
    //                 // if the flavor is a modifier, draw the color on the bottom
    //                 fillColor = 220;
    //                 p.fill(fillColor);
    //                 p.rect(30, y, h, h);
    //                 p.fill(Colors[key]);
    //                 p.rect(30, y + h - 5, h, 5);
    //             } else {
    //                 p.rect(30, y, h, h);
    //             }
    //             p.fill(10);
    //             p.textAlign(p.LEFT);
    //             p.text(dispText, 60, y + 10);
    //         } else {
    //             if (iter === numTeacher) y = height;
    //             // colored box
    //             p.rect(canvas.width - 60, y, h, h);
    //             // legend text
    //             p.fill(10);
    //             p.textAlign(p.RIGHT);
    //             p.text(dispText, canvas.width - 70, y + 10);
    //         }
    //
    //         iter++;
    //         // y += h + 3;
    //     }
    // }

    drawChart() {
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

    render() {
        return (
            <div className="text-center turn-taking-container">
              {/*<div className="turn-taking-key">*/}
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
              {/*</div>*/}
            </div>
        );
    }
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

// {(() => {
//     switch (item.speaker) {
//     case "teacher":   return "Teacher";
//     case "student": return "Student";
//     default: return "";
//   }
// })()}
