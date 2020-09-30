import React, { Component } from 'react';

import Parser from '../../../data/parser';

import LegendButtonGroup from '../../legend/LegendButtonGroup';
import TurnTakingSmall from '../turn-taking/TurnTakingSmall';
import Script from '../transcript/Script';
import displayLegendLabels from '../../legend/displayLegendLabels';

import removeArrayValue from '../../../utils/removeArrayValue';

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
            },
            chartOffsetWidth: 0,
            chartHeight: 0
        };
    }

    componentDidMount() {
        // dynamically orient and size TurnTakingSmall chart
        var legendButtonGroup = document.getElementsByClassName("transcript-visualization-legend")[0],
            chartOffsetWidth = legendButtonGroup.clientWidth,
            navbarDiv = document.getElementsByClassName("navbar"),
            navbar = navbarDiv && navbarDiv[0],
            buttonSelectorDiv = document.getElementsByClassName("button-selector"),
            buttonSelector = buttonSelectorDiv && buttonSelectorDiv[0],
            chartHeight = window.innerHeight - 2.5 * (navbar.clientHeight - buttonSelector.clientHeight); // this is good enough for now; ideally it captures focusBox.height in its sizing of the chart

        this.setState({
            chartOffsetWidth: chartOffsetWidth,
            chartHeight: chartHeight
        });

        // scroll to utterance ID on drilldown from TalkRatio or TurnTaking visualization
        // var url = window.location.href;
        //
        // if (url.indexOf("#") > -1) {
        //     var utteranceId = url.slice(url.indexOf("#") + 1, url.length);
        //     window.setTimeout(function() {
        //         var focusId = document.getElementById(utteranceId);
        //         var tempTop = focusId.getBoundingClientRect().top;
        //         // var navbar = document.getElementsByClassName("navbar")[0];
        //
        //         // TODO: Start here.
        //         if (focusId && navbar) {
        //             // const y = focusId.getBoundingClientRect().top - navbar.clientHeight;
        //             // window.scrollTo({top: y, behavior: 'smooth'});
        //             focusId.scrollIntoView();
        //             document.getElementsByClassName("transcript-visualization-container")[0].scrollTop -= navbar.clientHeight;
        //         }
        //     }, 1000);
        // }
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
        <div className="transcript-visualization-container" style={{ marginLeft: this.state.chartOffsetWidth }}>
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
            chartOffsetWidth={this.state.chartOffsetWidth}
            chartWidth={this.chartWidth}
            chartHeight={this.state.chartHeight}
            barHeight={this.barHeight}
            focusBox={this.state.focusBox} />

          <div className="transcript-script-container" style={{ marginLeft: `${this.chartWidth}px` }}>
            <Script
              data={Parser.transcript()}
              activeLabels={this.state.activeLabels}
              focusBox={this.state.focusBox}
              handleScroll={this.handleScroll.bind(this)}
              handleUtteranceClick={() => {}} />
          </div>
        </div>
      );
    }
}
