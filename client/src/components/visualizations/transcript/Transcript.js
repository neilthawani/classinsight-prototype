import React, { Component } from 'react';

import LegendButtonGroup from '../../legend/LegendButtonGroup';
import TurnTakingSmall from '../turn-taking/TurnTakingSmall';
import Script from '../transcript/Script';
import displayLegendLabels from '../../legend/displayLegendLabels';

import removeArrayValue from '../../../utils/removeArrayValue';

export default class Transcript extends Component {
    constructor(props) {
        super(props);

        var parser = props.activeParser,
            chartWidth = 2 * parser.maxNTokens(), // double width - for both left/right side of TurnTakingSmall chart
            talkRatios = parser.talkRatios(),
            transcript = parser.transcript();

        this.state = {
            parser: parser,
            activeLabels: [],
            focusBox: {
                topElId: 0,
                bottomElId: 0,
                y: 0,
                height: 0
            },
            chartWidth: chartWidth,
            chartHeight: 0,
            talkRatios: talkRatios,
            transcript: transcript
        };
    }

    componentDidMount() {
        // dynamically orient and size TurnTakingSmall chart
        var navbarDiv = document.getElementsByClassName("navbar"),
            navbar = navbarDiv && navbarDiv[0],
            buttonSelectorDiv = document.getElementsByClassName("button-selector"),
            buttonSelector = buttonSelectorDiv && buttonSelectorDiv[0],
            chartHeight = window.innerHeight - 2.5 * (navbar.clientHeight - buttonSelector.clientHeight); // this is good enough for now; ideally it captures focusBox.height in its sizing of the chart

        this.setState({
            chartHeight: chartHeight
        });
    }

    // same logic as in TurnTaking::handleFilterClick
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

        if (!turnTakingBarsSmall) return;

        var topOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${topElId}']`)[0];
        var bottomOfBox = turnTakingBarsSmall.querySelectorAll(`.turn-taking-bars-small-visualization [data-attr-utterance-id='${bottomElId}']`)[0];
        var topOfBoxY = topOfBox.getBoundingClientRect().y;
        var bottomOfBoxY = bottomOfBox.getBoundingClientRect().y;
        var boxHeight = bottomOfBoxY - topOfBoxY + 1;

        // focus the box
        turnTakingBarsSmall.scrollTo(0, topElId * this.barHeight);

        var focusBox = {
            topElId: topElId,
            bottomElId: bottomElId,
            height: boxHeight,
        };

        this.setState({
            focusBox: focusBox
        });
    }

    render() {
      return (
        <div className="transcript-visualization-container">
          <div className="transcript-visualization-legend">
            <LegendButtonGroup
              labels={displayLegendLabels(this.state.talkRatios, { type: "Teacher"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
            <LegendButtonGroup
              labels={displayLegendLabels(this.state.talkRatios, { type: "Student"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
            <LegendButtonGroup
              labels={displayLegendLabels(this.state.talkRatios, { type: "Technique"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
          </div>

          <TurnTakingSmall
            parser={this.state.parser}
            chartWidth={this.state.chartWidth}
            chartHeight={this.state.chartHeight}
            barHeight={this.barHeight}
            focusBox={this.state.focusBox} />

          <div className="transcript-script-container" style={{ marginLeft: `${this.state.chartWidth}px` }}>
            <Script
              transcript={this.state.transcript}
              activeLabels={this.state.activeLabels}
              focusBox={this.state.focusBox}
              handleScroll={this.handleScroll.bind(this)}
              handleUtteranceClick={() => {}} />
          </div>
        </div>
      );
    }
}
