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
            activeLabels: [],
            focusBox: {
                topElId: 0,
                bottomElId: 0,
                y: 0,
                height: 0
            }
        };
    }

    handleClick(label) {
        var activeLabels = this.state.activeLabels;

        if (activeLabels.includes(label.value)) {
            activeLabels = removeArrayValue(label.value, activeLabels)
        } else {
            activeLabels.push(label.value);
        }

        this.setState({
            activeLabels: activeLabels
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
