import React, { Component } from 'react';

import Parser from '../../../data/parser';

import Script from '../transcript/Script';

import drawBarStyles from './drawBarStyles';
import isObjectEmpty from '../../../utils/isObjectEmpty';

export default class Bar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        // prevent: if they click the script, it collapses the expanded set too
        if (evt.target.classList.toString().includes("turn-taking-bar")) {
            this.props.onRowClick(evt, this.props.data);
        }
    }

    render() {
      var item = this.props.data,
          focusObj = this.props.focusObj,
          isFocusRow = isObjectEmpty(focusObj) ?
                        false :
                        (item.id === focusObj.id && item.utterance === focusObj.utterance),
          itemTimestamp = item.timestamp,
          timeStamp = "";

      switch (item.timestamp.length) {
          case 0: break;
          case 1: timeStamp = itemTimestamp[0]; break;
          default: timeStamp = `${itemTimestamp[0]} - ${itemTimestamp[itemTimestamp.length - 1]}`;
      }

      var { teacherStyle, studentStyle } = drawBarStyles(item);

      var scriptData = Parser.filteredTranscript({activeFilters: this.props.activeFilters});

      return (
        <div className="turn-taking-visualization-row" onClick={this.handleClick}>
          <div className={itemTimestamp.length > 1 ? "turn-taking-bar-timestamp-range" : "turn-taking-bar-timestamp-time"}>
            {timeStamp}
          </div>
          <div key={item.id} className="turn-taking-bar">
            <div className="turn-taking-bar-teacher-outer">
              <div className="turn-taking-bar-teacher-inner" style={teacherStyle}>
              </div>
            </div>
            <div className="turn-taking-bar-student-outer">
              <div className="turn-taking-bar-student-inner" style={studentStyle}>
              </div>
            </div>
          </div>

          {isFocusRow ?
            <div className="turn-taking-visualization-row-drilldown">
              <Script
                data={scriptData}
                focusObj={this.props.focusObj} />
            </div>
          : '' }
        </div>
      );
    }
}
