import React, { Component } from 'react';
import LegendButtonGroup from '../../legend/LegendButtonGroup';
import TurnTakingSmall from '../turn-taking/TurnTakingSmall';
import Script from '../transcript/Script';

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { smallBarHeight } from '../turn-taking/barStyles';
import { changeActiveFilters } from '../../legend/labelFilters';

class Transcript extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFilters: [],
            focusBox: {
                topElId: 0,
                bottomElId: 0,
                y: 0,
                height: 0
            }
        };
    }

    handleClick(label) {
        this.setState({
            activeFilters: changeActiveFilters(this.state.activeFilters, label)
        });
    }

    barHeight = smallBarHeight;

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
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var parser = this.props.datasets.activeParser,
            chartWidth = 2 * parser.maxNTokens(), // double width - for both left/right side of TurnTakingSmall chart
            transcript = parser.transcript();

        return (
          <div className="transcript-visualization-container">
            <div className="transcript-visualization-legend">
              <LegendButtonGroup
                labels={parser.legendLabels({ speakerType: "Teacher"})}
                displayRatio={true}
                activeLabels={this.state.activeFilters}
                handleClick={this.handleClick.bind(this)} />
              <LegendButtonGroup
                labels={parser.legendLabels({ speakerType: "Student"})}
                displayRatio={true}
                activeLabels={this.state.activeFilters}
                handleClick={this.handleClick.bind(this)} />
            </div>

            <TurnTakingSmall
              parser={parser}
              chartWidth={chartWidth}
              barHeight={this.barHeight}
              focusBox={this.state.focusBox} />

            <div className="transcript-script-container" style={{ marginLeft: `${chartWidth - 20}px` }}>
              <Script
                transcript={transcript}
                activeLabels={this.state.activeFilters}
                focusBox={this.state.focusBox}
                handleScroll={this.handleScroll.bind(this)}
                handleUtteranceClick={() => {}} />
            </div>
          </div>
        );
    }
}

Transcript.propTypes = {
    datasets: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { }
)(Transcript));
