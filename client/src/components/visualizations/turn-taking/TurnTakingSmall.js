import React, { Component } from 'react';
import PropTypes from "prop-types";
import Parser from '../../../data/parser';
import drawBarStyles from './drawBarStyles';

export default class TurnTakingSmall extends Component {
    constructor(props) {
        super(props);
        this.chartWidth = this.props.chartWidth;
        this.boxHeight = this.props.boxHeight;
        this.boxHeightOffset = this.props.boxHeightOffset;
    }

    render() {
        var chartData = Parser.parsedData().expanded;

        return (
            <div className="turn-taking-bars-small-visualization" style={{ minWidth: `${this.chartWidth}px` }}>
              {chartData.map((item, index) => {
                  // console.log("item", item.id);
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
              <div className="turn-taking-bars-small-focus-box" style={{height: `${this.boxHeight}px`, top: `${this.boxHeightOffset}px`}}>
              </div>
            </div>
        );
    }
}

TurnTakingSmall.propTypes = {
    chartWidth: PropTypes.number.isRequired,
    boxHeight: PropTypes.number.isRequired,
    boxHeightOffset: PropTypes.number.isRequired
}
