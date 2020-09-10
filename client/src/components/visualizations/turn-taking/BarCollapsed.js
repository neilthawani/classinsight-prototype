import React, { Component } from 'react';
import PropTypes from "prop-types";

import LegendLabels from '../../../fixtures/legend_labels';
import Script from '../transcript/Script';
import isObjectEmpty from '../../../utils/isObjectEmpty';

export default class BarCollapsed extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    legendLabels = LegendLabels;

    handleClick(evt) {
        this.props.onRowClick(evt, this.props.data);
    }

    render() {
      var item = this.props.data,
          focusObj = this.props.focusObj,
          isFocusRow = isObjectEmpty(focusObj) ?
                        false :
                        (item.id === focusObj.id && item.utterance === focusObj.utterance),
          timeStamp = "";

      switch (item.time.length) {
          case 0: break;
          case 1: timeStamp = item.time[0]; break;
          default: timeStamp = `${item.time[0]} - ${item.time[item.time.length - 1]}`;
      }

      var isStudentData = item.speaker.includes("Student"),
          isTeacherData = item.speaker === "Teacher";

      var legendLabelValue = item.types[item.types.length - 1];
      var barColor = this.legendLabels.find(item => item.value === legendLabelValue).color;
      var barBorder = "";
      var boxSizing = "";
      if (item.types.length > 1) { // if it has multiple types, draw a border around the bar
          var borderValue = item.types && item.types[0];
          barBorder = `3px solid ${this.legendLabels.find(item => item.value === borderValue)}.color`;
          boxSizing = "border-box";
      }

      var barWidth = item.length,
          barHeight = "14px";

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
        <div className="turn-taking-visualization-row" onClick={this.handleClick}>
          <div className={item.time.length > 1 ? "turn-taking-bar-timestamp-range" : "turn-taking-bar-timestamp-time"}>
            {timeStamp}
          </div>
          <div key={item.id} className="turn-taking-bar">
            <div className="turn-taking-bar-teacher-outer">
              <div className="turn-taking-bar-teacher-inner" style={teacherStyle}>
              </div>
            </div>
            <div className="turn-taking-bar-student-outer">
              <div className="turn-taking-bar-student-inner" style={studentStyle}>
              </div>
            </div>
          </div>

          {isFocusRow ?
            <div className="turn-taking-visualization-row-drilldown">
              <Script focusObj={this.props.focusObj} />
            </div>
          : '' }
        </div>
      );
    }
}
