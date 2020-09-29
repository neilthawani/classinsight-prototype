import React, { Component } from 'react';

import Turn from '../transcript/Turn';

import drawBarStyles from './drawBarStyles';
import isObjectEmpty from '../../../utils/isObjectEmpty';

export default class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hoveredTurn: {}
        };
    }

    handleMouseOver() {
        if (isObjectEmpty(this.props.activeTurn)) {
            this.setState({
                hoveredTurn: this.props.data
            });
        }
    }

    handleMouseOut(value) {
        if (value.id !== this.props.activeTurn.id) {
            this.setState({
                hoveredTurn: {}
            });
        }
    }

    handleBarClick(turnObj) {
        this.props.handleBarClick(turnObj);
    }

    handleTextClick(turnId) {
        this.props.handleTextClick(turnId);
    }

    render() {
        var item = this.props.data,
            timeStamp = "";

        switch (item.timestamp.length) {
            case 0: break;
            case 1: timeStamp = item.timestamp[0]; break;
            default: timeStamp = `${item.timestamp[0]} - ${item.timestamp[item.timestamp.length - 1]}`;
        }

        var { teacherStyle, studentStyle } = drawBarStyles(item);

        var isActive = this.state.hoveredTurn.id === item.id || this.props.activeTurn.id === item.id;

        return (
          <div className="turn-taking-visualization-row"
          onMouseOver={this.handleMouseOver.bind(this, item)}
          onMouseOut={this.handleMouseOut.bind(this, item)}
          onClick={this.handleBarClick.bind(this, item)}>
            <div className={item.timestamp.length > 1 ? "turn-taking-bar-timestamp-range" : "turn-taking-bar-timestamp-time"}>
              {timeStamp}
            </div>
            <div key={item.id} className={isActive ? "turn-taking-bar active" : "turn-taking-bar"}>
              <div className="turn-taking-bar-teacher-outer">
                <div className="turn-taking-bar-teacher-inner" style={teacherStyle}></div>
              </div>
              <div className="turn-taking-bar-student-outer">
                <div className="turn-taking-bar-student-inner" style={studentStyle}></div>
              </div>
            </div>

            {isActive ?
              <Turn
                data={item}
                handleTextClick={this.handleTextClick.bind(this)} />
            : ""}
          </div>
      );
    }
}
