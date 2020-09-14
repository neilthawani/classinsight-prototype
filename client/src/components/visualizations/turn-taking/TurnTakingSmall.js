import React, { Component } from 'react';
import Parser from '../../../data/parser';
import drawBarStyles from './drawBarStyles';

export default class TurnTakingSmall extends Component {
    render() {
        var chartData = Parser.parsedData().expanded,
            chartWidth = { minWidth: `${2 * Parser.maxNTokens()}px` }; // double width - for both left/right side

        return (
            <div className="turn-taking-bars-small-visualization" style={chartWidth}>
              {chartData.map((item, index) => {
                  var { teacherStyle, studentStyle } = drawBarStyles(item, true);

                  return (
                      <div key={index} className="turn-taking-bar-small">
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
