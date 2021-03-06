import React, { Component } from 'react';

import Utterance from '../transcript/Utterance';

import { drawBarStyles } from './barStyles';
import isObjectEmpty from '../../../utils/isObjectEmpty';

export default class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hoveredTurn: {}
        };
    }

    // handleMouseOver() {
    //     if (isObjectEmpty(this.props.activeTurn)) {
    //         this.setState({
    //             hoveredTurn: this.props.data
    //         });
    //     }
    // }
    //
    // handleMouseOut(value) {
    //     if (value.id !== this.props.activeTurn.id) {
    //         this.setState({
    //             hoveredTurn: {}
    //         });
    //     }
    // }

    handleBarClick(turnObj) {
        this.props.handleBarClick(turnObj);
    }

    handleTextClick(turnId) {
        this.props.handleTextClick(turnId);
    }

    render() {
        var item = this.props.data;

        var { teacherStyle, studentStyle } = drawBarStyles(item);

        var isActive = this.state.hoveredTurn.id === item.id || this.props.activeTurn.id === item.id;
        {/*onMouseOver={this.handleMouseOver.bind(this, item)}
        onMouseOut={this.handleMouseOut.bind(this, item)}*/}
        return (
          <div className="turn-taking-visualization-row"
          onClick={this.handleBarClick.bind(this, item)}>
            <div className="turn-taking-bar-timestamp-time">
              {item.timestamp}
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
              <Utterance
                utterance={item}
                canInspect={true}
                handleUtteranceClick={this.handleTextClick.bind(this)} />
            : ""}
          </div>
      );
    }
}
