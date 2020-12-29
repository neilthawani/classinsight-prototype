import React, { Component } from 'react';

// import BaseVisualization from '../BaseVisualization';
import TalkRatioSection from './TalkRatioSection';
import Script from '../transcript/Script';
import LegendItemGroup from '../../legend/LegendItemGroup';

import formatPercentage from '../../../utils/formatPercentage';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listDatasets } from "../../../actions/datasetActions";
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
        // console.log("TalkRatio constructor");
        super(props);
        // console.log("props", props);
        console.log("TalkRatio constructor, props.datasets:", props.datasets);
        // console.log("props", props);
        // props.match.params.userId

        var parser = props.datasets.activeParser;
        console.log("parser", parser);
        if (!parser) {
            console.log("no parser");
            props.listDatasets(props.match.params.userId).then((response) => {
                console.log("here", response);
            });
        }
        // || JSON.parse(localStorage.getItem("datasets")).activeParser,
        var talkRatios = parser.talkRatios(),
            teacherTalkRatios = parser.teacherTalkRatios(),
            studentTalkRatios = parser.studentTalkRatios(),
            speakerTalkTotals = parser.speakerTalkTotals(),
            transcript = parser.transcript();

        this.state = {
            parser: parser,
            drilldownFilter: "",
            talkRatios: talkRatios,
            teacherTalkRatios: teacherTalkRatios,
            studentTalkRatios: studentTalkRatios,
            speakerTalkTotals: speakerTalkTotals,
            transcript: transcript
        };
    }

    componentDidMount() {
        console.log("TalkRatio componentDidMount");
        console.log("this.props.datasets", this.props.datasets);
    }

    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     console.log("getSnapshotBeforeUpdate");
    // }
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log("componentDidUpdate");
    // }
    //
    // static getDerivedStateFromProps(props, state) {
    //     console.log("getDerivedStateFromProps");
    //     return null;
    // }
    //
    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log("shouldComponentUpdate");
    //     return true;
    // }

    calculateSpeakerTotal(type) {
        var speakerTotalObj = this.state.speakerTalkTotals.filter((item) => item.speakerType === type);
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
        // debugger;
        var slashTurnTaking = this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf("/"));
        var newPathname = this.props.location.pathname.replace(slashTurnTaking, `/transcript#${utteranceId}`);
        this.props.history.push(newPathname);
        // this.props.history.push(`/transcript#${utteranceId}`);
        // localStorage.setItem("buttonSelectorSelectedOption", "transcript");
    }

    render() {
      return (
        <div className="talk-ratio-visualization-container">
          <div className="talk-ratio-legend-teacher">
            <h3 className="talk-ratio-visualization-heading">
              Teacher Talk: {formatPercentage(this.calculateSpeakerTotal("Teacher"), 0)}
            </h3>
            <LegendItemGroup
              labels={this.state.parser.legendLabels({ type: "Teacher" })}
              displayRatio={true}
              handleClick={() => {}} />
            <LegendItemGroup
              labels={this.state.parser.legendLabels({ type: "Media" })}
              displayRatio={true}
              handleClick={() => {}} />
          </div>
          <div className="talk-ratio-visualization">
            <div className="talk-ratio-visualization-chart">
              {this.state.teacherTalkRatios.map((item, index, array) => {
                  return (
                    <TalkRatioSection
                      key={index}
                      data={item}
                      handleTalkRatioSectionClick={this.handleTalkRatioSectionClick.bind(this)} />
                  );
              })}
              <div className="talk-ratio-visualization-divider"></div>
              {this.state.studentTalkRatios.map((item, index, array) => {
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
                  parser={this.state.parser}
                  transcript={this.state.transcript}
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
              labels={this.state.parser.legendLabels({ type: "Student" })}
              displayRatio={true}
              handleClick={() => {}} />
          </div>
        </div>
      )
    }
}



TalkRatio.propTypes = {
    // auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    // admin: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        // auth: state.auth,
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets }
)(TalkRatio));


// export default TalkRatio;
