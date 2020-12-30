import React, { Component } from 'react';
// import BaseVisualization from '../BaseVisualization';
import LegendButtonGroup from '../../legend/LegendButtonGroup';
import TurnTakingSmall from '../turn-taking/TurnTakingSmall';
import Script from '../transcript/Script';

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import removeArrayValue from '../../../utils/removeArrayValue';

class Transcript extends Component {
    constructor(props) {
        super(props);
        // console.log("Transcript constructor");//, props.datasets:", props.datasets);
        // console.log("props", props);
        // props.match.params.userId



        this.state = {
            // parser: parser,
            activeLabels: [],
            focusBox: {
                topElId: 0,
                bottomElId: 0,
                y: 0,
                height: 0
            },
            // chartWidth: chartWidth,
            // talkRatios: talkRatios,
            // transcript: transcript
        };
    }

    // componentDidMount() {
    //     console.log("Transcript componentDidMount");
    //     console.log("this.props.datasets", this.props.datasets);
    // }

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
      var parser = this.props.datasets.activeParser,// || localStorage.getItem("activeParser"),
          chartWidth = 2 * parser.maxNTokens(), // double width - for both left/right side of TurnTakingSmall chart
          // talkRatios = parser.talkRatios(),
          transcript = parser.transcript();

      return (
        <div className="transcript-visualization-container">
          <div className="transcript-visualization-legend">
            <LegendButtonGroup
              labels={parser.legendLabels({ type: "Teacher"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
            <LegendButtonGroup
              labels={parser.legendLabels({ type: "Student"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
            <LegendButtonGroup
              labels={parser.legendLabels({ type: "Technique"})}
              displayRatio={true}
              activeLabels={this.state.activeLabels}
              handleClick={this.handleClick.bind(this)} />
          </div>

          <TurnTakingSmall
            parser={parser}
            chartWidth={chartWidth}

            barHeight={this.barHeight}
            focusBox={this.state.focusBox} />

          <div className="transcript-script-container" style={{ marginLeft: `${chartWidth}px` }}>
            <Script
              transcript={transcript}
              activeLabels={this.state.activeLabels}
              focusBox={this.state.focusBox}
              handleScroll={this.handleScroll.bind(this)}
              handleUtteranceClick={() => {}} />
          </div>
        </div>
      );
    }
}

Transcript.propTypes = {
    // auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    // admin: PropTypes.object.isRequired,
    // showDataset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        // auth: state.auth,
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { }
)(Transcript));
