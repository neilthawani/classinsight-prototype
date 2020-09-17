import React, { Component } from 'react';

import Parser from '../../data/parser';

import LegendButtonGroup from '../legend/LegendButtonGroup';
import TurnTakingSmall from './turn-taking/TurnTakingSmall';
import Script from './transcript/Script';
import displayLegendLabels from '../legend/displayLegendLabels';

import removeArrayValue from '../../utils/removeArrayValue';

export default class Transcript extends Component {
    constructor(props) {
        super(props);

        // double width - for both left/right side of TurnTakingSmall chart
        this.chartWidth = 2 * Parser.maxNTokens();

        this.state = {
            activeLabels: ["Metacognitive Modeling Questions", "Teacher Explanation + Evidence", "Teacher Open-Ended S/Q", "Teacher Close-Ended S/Q", "Assorted Teacher Talk", "Student Explanation + Evidence", "Student Open-Ended S/Q", "Student Open-Ended Response", "Student Close-Ended S/Q", "Student Close-Ended Response", "Turn-Taking Facilitation", "Re-Voicing", "Behavior Management Questions"],
            focusBox: {
                topElId: 0,
                bottomElId: 0,
                y: 0,
                height: 0
            }
        };
    }

    handleClick(label) {
        var activeLabels = this.state.activeLabels,
            newLabels = activeLabels.includes(label.value) ?
                        removeArrayValue(label.value, activeLabels) :
                        activeLabels.push(label.value);

        this.setState({
            activeLabels: newLabels
        });
    }

    barHeight = 3

    handleScroll(topElId, bottomElId) {
        // calculate focusBox.height
        var turnTakingBarsSmall = document.getElementsByClassName("turn-taking-bars-small-visualization")[0];
        var topOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${topElId}']`)[0];
        var bottomOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${bottomElId}']`)[0];
        var topOfBoxY = topOfBox.getBoundingClientRect().y;
        var bottomOfBoxY = bottomOfBox.getBoundingClientRect().y;
        var boxHeight = bottomOfBoxY - topOfBoxY + 1;

        // focus the box
        turnTakingBarsSmall.scrollTo(0, topElId * this.barHeight);

        this.setState({
            focusBox: {
                topElId: topElId,
                bottomElId: bottomElId,
                height: boxHeight,
            }
        });
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
            barHeight={this.barHeight}
            focusBox={this.state.focusBox} />

          <div className="transcript-script-container" style={{ marginLeft: `${this.chartWidth}px` }}>
            <Script
              data={Parser.transcript()}
              activeLabels={this.state.activeLabels}
              handleScroll={this.handleScroll.bind(this)}
              focusBox={this.state.focusBox} />
          </div>
        </div>
      );
    }
}
