import React, { Component } from 'react';
import PropTypes from "prop-types";
import Parser from '../../../data/parser';
import drawBarStyles from './drawBarStyles';

export default class TurnTakingSmall extends Component {
    constructor(props) {
        super(props);
        this.chartWidth = this.props.chartWidth;
        this.focusBox = this.props.focusBox;
    }

    barHeight = 3

    render() {
        var chartData = Parser.parsedData().expanded,
            focusBox = this.props.focusBox,
            boxHeight = focusBox.height + this.barHeight,
            boxOffset = this.barHeight * focusBox.topElId;

        return (
            <div className="turn-taking-bars-small-visualization" style={{ minWidth: `${this.chartWidth}px` }}>
              <div className="turn-taking-bars-small-focus-box" style={{height: `${boxHeight}px`, top: boxOffset}}>
              </div>
              {chartData.map((item, index) => {
                  var { teacherStyle, studentStyle } = drawBarStyles(item, true);

                  return (
                      <div key={index} className="turn-taking-bar-small" data-attr-utterance-id={item.id} style={{height: `${this.barHeight}px`}}>
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
            </div>
        );
    }
}

TurnTakingSmall.propTypes = {
    chartWidth: PropTypes.number.isRequired,
    focusBox: PropTypes.object.isRequired
};
