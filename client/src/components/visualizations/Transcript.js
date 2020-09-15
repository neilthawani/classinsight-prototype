import React, { Component } from 'react';

import TranscriptOld from './TranscriptOld';

import LegendButtonGroup from '../legend/LegendButtonGroup';
import displayLegendLabels from '../legend/displayLegendLabels';
import TurnTakingSmall from './turn-taking/TurnTakingSmall';
import Script from './transcript/Script';
import Parser from '../../data/parser';

import removeArrayValue from '../../utils/removeArrayValue';

export default class Transcript extends Component {
    constructor(props) {
        super(props);

        this.chartWidth = 2 * Parser.maxNTokens(); // double width - for both left/right side of TurnTakingSmall chart

        this.state = {
            activeLabels: ["Metacognitive Modeling Questions", "Teacher Explanation + Evidence", "Teacher Open-Ended S/Q", "Teacher Close-Ended S/Q", "Assorted Teacher Talk", "Student Explanation + Evidence", "Student Open-Ended S/Q", "Student Open-Ended Response", "Student Close-Ended S/Q", "Student Close-Ended Response", "Turn-Taking Facilitation", "Re-Voicing", "Behavior Management Questions"],
            topOfBox: 0,
            bottomOfBox: 0
        };
    }

    handleClick(label) {
        var activeLabels = this.state.activeLabels,
            newLabels = activeLabels.includes(label.value) ?
                        removeArrayValue(label.value, activeLabels) :
                        activeLabels.push(label.value);

        this.setState({
            activeLabels: activeLabels
        });
    }

    handleScroll(topElId, bottomElId) {
        console.log("handleScroll base", topElId, bottomElId);
        // debugger;
        var turnTakingBarsSmall = document.getElementsByClassName("turn-taking-bars-small-visualization")[0];

        // turnTakingBarsSmall.scrollTo(0, 500)
        var topOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${topElId}']`)[0];
        var bottomOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${bottomElId}']`)[0];
        // debugger;

        turnTakingBarsSmall.scrollTo(0, bottomOfBox.getBoundingClientRect().top)

        // console.log("topElId", topElId, "bottomElId", bottomElId);

        // this.setState({
        //     turnTakingScrollY: 0
        // });
        console.log("this.state.activeLabels", this.state.activeLabels);
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
            topOfBox={this.state.topOfBox}
            bottomOfBox={this.state.bottomOfBox} />

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
