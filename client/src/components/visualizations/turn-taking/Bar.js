import React, { Component } from 'react';

import Parser from '../../../data/parser';

import HoverScript from './HoverScript';

import drawBarStyles from './drawBarStyles';
// import isObjectEmpty from '../../../utils/isObjectEmpty';

export default class Bar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hoveredTurn: {}
        };
        // this.handleClick = this.handleClick.bind(this);
    }

    handleMouseOver(evt) {
        // console.log("this.props.data", this.props.data);
        this.setState({
            hoveredTurn: this.props.data
        });
        // console.log("item", item);
        // prevent: if they click the script, it collapses the expanded set too
        // if (evt.target.classList.toString().includes("turn-taking-bar")) {
        //     this.props.onRowClick(evt, this.props.data);
        // }
    }

    handleMouseOut() {
        this.setState({
            hoveredTurn: {}
        });
    }

    render() {
      var item = this.props.data,
          // focusObj = this.props.focusObj,
          // isFocusRow = isObjectEmpty(focusObj) ?
          //               false :
          //               (item.id === focusObj.id && item.utterance === focusObj.utterance),
          // itemTimestamp = item.timestamp,
          timeStamp = "";
      // console.log("item", item);
      // console.log("isFocusRow", isFocusRow);
      // if (isFocusRow) {
      //     console.log("item", item);
      // }
      switch (item.timestamp.length) {
          case 0: break;
          case 1: timeStamp = item.timestamp[0]; break;
          default: timeStamp = `${item.timestamp[0]} - ${item.timestamp[item.timestamp.length - 1]}`;
      }

      var { teacherStyle, studentStyle } = drawBarStyles(item);
      // console.log("this.props.focusObj", this.props.focusObj);

      return (
        <div className="turn-taking-visualization-row"
        onMouseOver={this.handleMouseOver.bind(this, item)}
        onMouseOut={this.handleMouseOut.bind(this, item)}>
          <div className={item.timestamp.length > 1 ? "turn-taking-bar-timestamp-range" : "turn-taking-bar-timestamp-time"}>
            {timeStamp}
          </div>
          <div key={item.id} className="turn-taking-bar">
            <div className="turn-taking-bar-teacher-outer">
              <div className="turn-taking-bar-teacher-inner" style={teacherStyle}></div>
            </div>
            <div className="turn-taking-bar-student-outer">
              <div className="turn-taking-bar-student-inner" style={studentStyle}></div>
              {this.state.hoveredTurn.id === item.id ?
              <HoverScript
                data={item} />
              : ""}
            </div>
          </div>
        </div>
      );
    }
}
