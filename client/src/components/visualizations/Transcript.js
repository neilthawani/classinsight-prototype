import React, { Component } from 'react';

// import TranscriptOld from './TranscriptOld';

import LegendButtonGroup from '../legend/LegendButtonGroup';
import displayLegendLabels from '../legend/displayLegendLabels';
import TurnTakingSmall from './turn-taking/TurnTakingSmall';
import Script from './transcript/Script';
import Parser from '../../data/parser';

import removeArrayValue from '../../utils/removeArrayValue';
import getElementIdsForFocusWindow from './transcript/getElementIdsForFocusWindow';

export default class Transcript extends Component {
    constructor(props) {
        super(props);

        this.chartWidth = 2 * Parser.maxNTokens(); // double width - for both left/right side of TurnTakingSmall chart

        this.state = {
            activeLabels: ["Metacognitive Modeling Questions", "Teacher Explanation + Evidence", "Teacher Open-Ended S/Q", "Teacher Close-Ended S/Q", "Assorted Teacher Talk", "Student Explanation + Evidence", "Student Open-Ended S/Q", "Student Open-Ended Response", "Student Close-Ended S/Q", "Student Close-Ended Response", "Turn-Taking Facilitation", "Re-Voicing", "Behavior Management Questions"],
            focusBox: {
                // x: 0,
                y: 0,
                height: 0
            }
            // topOfBox: 0,
            // bottomOfBox: 0,
            // boxHeight: 0,
            // boxHeightOffset: 0,
            // topElId: 0,
            // bottomElId: 0
        }
    }

    // componentDidMount() {
        // var { topElId, bottomElId } = getElementIdsForFocusWindow();
        // this.updateBoxRangeIds(topElId, bottomElId);
    // }

    // updateBoxRangeIds(topElId, bottomElId) {
    //     this.setState({
    //         topElId: topElId,
    //         bottomElId: bottomElId
    //     });
    // }

    handleClick(label) {
        var activeLabels = this.state.activeLabels,
            newLabels = activeLabels.includes(label.value) ?
                        removeArrayValue(label.value, activeLabels) :
                        activeLabels.push(label.value);

        this.setState({
            activeLabels: newLabels
        });
    }

    // https://stackoverflow.com/questions/43441856/how-to-scroll-to-an-element
    handleScroll(topElId, bottomElId) {
        // this.updateBoxRangeIds(topElId, bottomElId);

        // console.log("handleScroll base", topElId, bottomElId);
        // debugger;
        var turnTakingBarsSmall = document.getElementsByClassName("turn-taking-bars-small-visualization")[0];

        // turnTakingBarsSmall.scrollTo(0, 500)
        var topOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${topElId}']`)[0];
        var bottomOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${bottomElId}']`)[0];

        // var topOfBoxX = topOfBox.getBoundingClientRect().x;
        var topOfBoxY = topOfBox.getBoundingClientRect().y;
        var bottomOfBoxY = bottomOfBox.getBoundingClientRect().y;
        // debugger;
        console.log("topOfBox", topOfBox, "bottomOfBox", bottomOfBox);
        // console.log("topOfBoxY", topOfBoxY, "bottomOfBoxY", bottomOfBoxY);

        // get value of top: attribute for focus box
        var offset = parseInt(topOfBox.getAttribute("data-attr-utterance-id"), 10) / turnTakingBarsSmall.querySelectorAll(".turn-taking-bar-small").length;
        console.log("offset", offset);
        var boxHeight = bottomOfBoxY - topOfBoxY;
        // var boxHeightOffset = topOfBoxY - turnTakingBarsSmall.clientHeight / 2;

        // console.log("boxHeight", boxHeight);
        // console.log("boxHeightOffset", boxHeightOffset);

        // if (topOfBoxY > turnTakingBarsSmall.clientHeight / 2) {
        //     turnTakingBarsSmall.scrollTo(0, boxHeightOffset);
        // }
        // debugger;
        this.setState({
            focusBox: {
                // x: topOfBoxX,
                offset: offset,
                height: boxHeight
            }
        })

        // console.log("topElId", topElId, "bottomElId", bottomElId);

        // this.setState({
        //     boxHeight: boxHeight,
        //     boxHeightOffset: boxHeightOffset
        // });
        // console.log("this.state.activeLabels", this.state.activeLabels);
    }

    render() {
      return (
        <div className="transcript-visualization-container">
          <div className="transcript-visualization-legend">
            <LegendButtonGroup
              labels={displayLegendLabels({ type: "Teacher"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
            <LegendButtonGroup
              labels={displayLegendLabels({ type: "Student"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
            <LegendButtonGroup
              labels={displayLegendLabels({ type: "Technique"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
          </div>

          <TurnTakingSmall
            chartWidth={this.chartWidth}
            focusBox={this.state.focusBox} />

          <div className="transcript-script-container" style={{ marginLeft: `${this.chartWidth}px` }}>
            <Script
              data={Parser.transcript()}
              activeLabels={this.state.activeLabels}
              handleScroll={this.handleScroll.bind(this)} />
          </div>
        </div>
      );
    }
}
