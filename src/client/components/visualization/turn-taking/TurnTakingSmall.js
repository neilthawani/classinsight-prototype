import React, { Component } from 'react';
import PropTypes from "prop-types";
import { drawBarStyles } from './barStyles';

export default class TurnTakingSmall extends Component {
    render() {
        var chartData = this.props.parser.filteredTranscript(),
            chartWidth = this.props.chartWidth,
            barHeight = this.props.barHeight,
            focusBox = this.props.focusBox,
            boxHeight = focusBox.height + barHeight,
            boxOffset = barHeight * focusBox.topElId;

        console.log("TurnTakingSmall::chartWidth", chartWidth);

        return (
            <div className="turn-taking-bars-small-visualization" style={{ width: `${chartWidth}px` }}>
              {chartData.map((item, index) => {
                  var { teacherStyle, studentStyle } = drawBarStyles(item, true);

                  return (
                      <div key={index} className="turn-taking-bar-small" data-attr-utterance-id={item.id} style={{height: `${barHeight}px`}}>
                        <div className="turn-taking-bar-teacher-outer">
                          <div className="turn-taking-bar-teacher-inner" style={teacherStyle}>
                          </div>
                        </div>
                        <div className="turn-taking-bar-student-outer">
                          <div className="turn-taking-bar-student-inner" style={studentStyle}>
                          </div>
                        </div>
                      </div>
                  );
              })}
              <div className="turn-taking-bars-small-focus-box" style={{height: `${boxHeight}px`, top: boxOffset}}>
              </div>
            </div>
        );
    }
}

TurnTakingSmall.propTypes = {
    chartWidth: PropTypes.number.isRequired,
    barHeight: PropTypes.number.isRequired,
    focusBox: PropTypes.object.isRequired
};
