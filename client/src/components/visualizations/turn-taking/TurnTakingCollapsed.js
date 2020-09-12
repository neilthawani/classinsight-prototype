import React, { Component } from 'react';
import Parser from '../../../data/parser';
import drawBarStyles from './drawBarStyles';

export default class TurnTakingCollapsed extends Component {
    render() {
        var chartData = Parser.parsedData().collapsed;

        return (
            <div className="turn-taking-bars-collapsed-visualization">
              {chartData.map((item, index) => {
                  var { teacherStyle, studentStyle } = drawBarStyles(item, true);

                  {/* .turn-taking-bar-collapsed is the only novel class here that isn't in turn_taking.scss
                      the outer/inner bar styles are shared with the TurnTaking component */}
                  return (
                      <div key={index} className="turn-taking-bar-collapsed">
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
