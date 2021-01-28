import React, { Component } from 'react';

import TalkRatioSection from './TalkRatioSection';
import Script from '../transcript/Script';
import LegendItemGroup from '../../legend/LegendItemGroup';

import formatPercentage from '../../../utils/formatPercentage';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

/*
For this file, the data we're after is in data.segments[0].speaking_turns.
Each object in this array is a record of someone speaking. It has this structure:
{
    duration: 0
    end_time: "[00:00:00;23]",
​​​​    initial_time: "[00:00:00;23]",
    speaker_pseudonym: "Teacher",
    tokens_per_second: 0,
​​​​​    total_tokens: 108,
​​​​​    utterances: [],
}

Utterances is an array of objects that contain information about what was said.
Each object in the array has this structure:
{
    line_number: "8",
​​​​​​​    n_tokens: 14,
​​​​​​​​    timestamp: "",
​​​​​​​​    utterance: "Ok, so what is it that you though- ...",
    utterance_type: [ " Teachers  Open-Ended  Statements/Question (S/Q)" ]
}
*/

class TalkRatio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drilldownFilter: "",
        };
    }

    calculateSpeakerTotal(type) {
        var parser = this.props.datasets.activeParser;
        var speakerTalkTotals = parser.speakerTalkTotals();
        var speakerTotalObj = speakerTalkTotals.filter((item) => item.speakerType === type);
        return speakerTotalObj[0].totalTalkPercentage;
    }

    handleTalkRatioSectionClick(label) {
        var drilldownFilter = label.value === this.state.drilldownFilter ? "" : label.value;

        if (drilldownFilter === this.state.drilldownFilter) {
            drilldownFilter = "";
        }

        this.setState({
            drilldownFilter: drilldownFilter
        });
    }

    handleUtteranceClick(utteranceId) {
        var slashTurnTaking = this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf("/"));
        var newPathname = this.props.location.pathname.replace(slashTurnTaking, `/transcript#${utteranceId}`);
        this.props.history.push(newPathname);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var parser = this.props.datasets.activeParser,
            teacherTalkRatios = parser.teacherTalkRatios(),
            studentTalkRatios = parser.studentTalkRatios(),
            transcript = parser.transcript();

        return (
          <div className="talk-ratio-visualization-container">
            <div className="talk-ratio-legend-teacher">
              <h3 className="talk-ratio-visualization-heading">
                Teacher Talk: {formatPercentage(this.calculateSpeakerTotal("Teacher"), 0)}
              </h3>
              <LegendItemGroup
                labels={parser.legendLabels({ type: "Teacher" })}
                displayRatio={true}
                handleClick={() => {}} />
              <LegendItemGroup
                labels={parser.legendLabels({ type: "Media" })}
                displayRatio={true}
                handleClick={() => {}} />
            </div>
            <div className="talk-ratio-visualization">
              <div className="talk-ratio-visualization-chart">
                {teacherTalkRatios.map((item, index, array) => {
                    return (
                      <TalkRatioSection
                        key={index}
                        data={item}
                        handleTalkRatioSectionClick={this.handleTalkRatioSectionClick.bind(this)} />
                    );
                })}
                <div className="talk-ratio-visualization-divider"></div>
                {studentTalkRatios.map((item, index, array) => {
                    return (
                      <TalkRatioSection
                        key={index}
                        data={item}
                        handleTalkRatioSectionClick={this.handleTalkRatioSectionClick.bind(this)} />
                    );
                })}
              </div>
              <div className="talk-ratio-visualization-drilldown">
                {this.state.drilldownFilter ?
                  <Script
                    parser={parser}
                    transcript={transcript}
                    drilldownFilter={this.state.drilldownFilter}
                    canInspect={true}
                    handleUtteranceClick={this.handleUtteranceClick.bind(this)}
                    handleScroll={() => {}} />
                : ""}
              </div>
            </div>
            <div className="talk-ratio-legend-student">
              <h3 className="talk-ratio-visualization-heading text-right">
                Student Talk: {formatPercentage(this.calculateSpeakerTotal("Student"), 0)}
              </h3>
              <LegendItemGroup
                labels={parser.legendLabels({ type: "Student" })}
                displayRatio={true}
                handleClick={() => {}} />
            </div>
          </div>
        )
    }
}

TalkRatio.propTypes = {
    datasets: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  {}
)(TalkRatio));