import React, { Component } from 'react';
import PropTypes from "prop-types";
import Parser from '../../../data/parser';
import drawBarStyles from './drawBarStyles';
import formatPercentage from '../../../utils/formatPercentage';

export default class TurnTakingSmall extends Component {
    constructor(props) {
        super(props);
        this.chartWidth = this.props.chartWidth;
        this.focusBox = this.props.focusBox;
    }

    render() {
        var chartData = Parser.parsedData().expanded,
            focusBox = this.props.focusBox,
            boxHeight = focusBox.height,
            boxOffset = focusBox.offset;

        console.log("boxOffset", boxOffset);

        return (
            <div className="turn-taking-bars-small-visualization" style={{ minWidth: `${this.chartWidth}px` }}>
              <div className="turn-taking-bars-small-focus-box" style={{height: `${boxHeight}px`, top: formatPercentage(boxOffset)}}>
              </div>
              {chartData.map((item, index) => {
                  var { teacherStyle, studentStyle } = drawBarStyles(item, true);

                  return (
                      <div key={index} className="turn-taking-bar-small" data-attr-utterance-id={item.id}>
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
    // boxHeight: PropTypes.number.isRequired,
    // boxHeightOffset: PropTypes.number.isRequired
}
