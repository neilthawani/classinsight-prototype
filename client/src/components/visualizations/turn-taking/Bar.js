import React, { Component } from 'react';
import LegendLabels from '../../../fixtures/legend_labels';
import Script from '../transcript/Script';

export default class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focusText: null
        };
    }

    legendLabels = LegendLabels;

    handleClick(textValue) {
        console.log("click", textValue);
        if (textValue === this.state.focusText) {
            this.setState({focusText: null});
        } else {
            this.setState({focusText: textValue});
        }
    }

    render() {
      var item = this.props.data,
          text = item.content,
          focusText = this.props.focusText;

      var timeStamp = item.time ? item.time : "";

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

      // https://stackoverflow.com/questions/38401902/onclick-not-working-react-js
      return (
        <div>
          <div className="turn-taking-visualization-row" onClick={this.handleClick.bind(this, text)}>
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

          {focusText !== null ?
            <div className="turn-taking-visualization-row-drilldown">
              <Script focusText={focusText} />
            </div>
          : ""}
        </div>
      );
    }
}
