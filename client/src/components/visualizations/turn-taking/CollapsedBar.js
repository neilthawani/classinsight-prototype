import React, { Component } from 'react';

import LegendLabels from '../../../fixtures/legend_labels';

export default class CollapsedBar extends Component {
    legendLabels = LegendLabels;

    render() {
      var item = this.props.data;

      var isStudentData = item.speaker.includes("Student"),
          isTeacherData = item.speaker === "Teacher";

      var legendLabelValue = item.types[item.types.length - 1];
      var barColor = this.legendLabels.find(item => item.value === legendLabelValue).color;
      var barBorder = "";
      var boxSizing = "";
      if (item.types.length > 1) { // if it has multiple types, draw a border around the bar
          var borderValue = item.types && item.types[0];
          barBorder = `1px solid ${this.legendLabels.find(item => item.value === borderValue)}.color`;
          boxSizing = "border-box";
      }

      var barWidth = item.length,
          barHeight = "1px";

      var baseStyle = { height: barHeight },
          extendedStyle = { backgroundColor: barColor, border: barBorder, boxSizing: boxSizing, width: barWidth },
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
          <div className="turn-taking-bar">
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
}
