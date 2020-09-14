import React, { Component } from 'react';

import LegendItemGroup from '../legend/LegendItemGroup';
import displayLegendLabels from '../legend/displayLegendLabels';

import Parser from '../../data/parser';
import formatPercentage from '../../utils/formatPercentage';

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
