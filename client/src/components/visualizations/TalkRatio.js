import React, { Component } from 'react';

import Parser from '../../data/parser';

import LegendItemGroup from '../legend/LegendItemGroup';
import displayLegendLabels from '../legend/displayLegendLabels';

import formatPercentage from '../../utils/formatPercentage';

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

export default class TalkRatio extends Component {
    calculateSpeakerTotal(type) {
        var speakerTotalObj = Parser.speakerTalkTotals().filter((item) => item.speakerType === type);
        return speakerTotalObj[0].totalTalkPercentage;
    }

    teacherTalkRatio = Parser.talkRatios().filter((item) => item.type === "Teacher").reverse();
    studentTalkRatio = Parser.talkRatios().filter((item) => item.type === "Student");

    formatStyle(item) {
        return {
            height: "50px",
            width: formatPercentage(item.percentage, 2, false),
            backgroundColor: item.barColor
        }
    }

    render() {
      return (
        <div className="talk-ratio-visualization-container">
          <div className="talk-ratio-legend-teacher">
            <h3 className="talk-ratio-visualization-heading">
              Teacher Talk: {formatPercentage(this.calculateSpeakerTotal("Teacher"), 0)}
            </h3>
            <LegendItemGroup labels={displayLegendLabels({ type: "Teacher"})} displayRatio={true} />
          </div>
          <div className="talk-ratio-visualization">
            {this.teacherTalkRatio.map((item, index, array) => {
                return (
                  <div key={index} className="talk-ratio-visualization-section" style={this.formatStyle(item)}></div>
                );
            })}
            <div class="talk-ratio-visualization-divider"></div>
            {this.studentTalkRatio.map((item, index, array) => {
                return (
                  <div key={index} className="talk-ratio-visualization-section" style={this.formatStyle(item)}></div>
                );
            })}
          </div>
          <div className="talk-ratio-legend-student">
            <h3 className="talk-ratio-visualization-heading">
              Student Talk: {formatPercentage(this.calculateSpeakerTotal("Student"), 0)}
            </h3>
            <LegendItemGroup labels={displayLegendLabels({ type: "Student" })} displayRatio={true} />
          </div>
        </div>
      )
    }
}
