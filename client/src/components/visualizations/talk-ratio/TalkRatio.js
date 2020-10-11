import React, { Component } from 'react';

import Parser from '../../../data/parser';

import TalkRatioSection from './TalkRatioSection';
import Script from '../transcript/Script';
import LegendItemGroup from '../../legend/LegendItemGroup';
import displayLegendLabels from '../../legend/displayLegendLabels';

import formatPercentage from '../../../utils/formatPercentage';

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

export default class TalkRatio extends Component {
    constructor(props) {
        super(props);

        var parser = new Parser(props.data);
        // console.log("this.parser", this.parser);

        var talkRatios = parser.talkRatios(),
            teacherTalkRatio = talkRatios.filter((item) => item.type === "Teacher").reverse(),
            studentTalkRatio = talkRatios.filter((item) => item.type === "Student"),
            speakerTalkTotals = parser.speakerTalkTotals();

        this.state = {
            parser: parser,
            drilldownFilter: "",
            talkRatios: talkRatios,
            teacherTalkRatio: teacherTalkRatio,
            studentTalkRatio: studentTalkRatio,
            speakerTalkTotals: speakerTalkTotals,
            transcript: parser.transcript()
        };
    }

    calculateSpeakerTotal(type) {
        var speakerTotalObj = this.state.speakerTalkTotals.filter((item) => item.speakerType === type);
        return speakerTotalObj[0].totalTalkPercentage;
    }

    // teacherTalkRatio = this.parser.talkRatios().filter((item) => item.type === "Teacher").reverse();
    // studentTalkRatio = this.parser.talkRatios().filter((item) => item.type === "Student");

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
        this.props.history.push(`/dashboard/transcript#${utteranceId}`);
        localStorage.setItem("buttonSelectorSelectedOption", "transcript");
    }

    render() {
      return (
        <div className="talk-ratio-visualization-container">
          <div className="talk-ratio-legend-teacher">
            <h3 className="talk-ratio-visualization-heading">
              Teacher Talk: {formatPercentage(this.calculateSpeakerTotal("Teacher"), 0)}
            </h3>
            <LegendItemGroup
              labels={displayLegendLabels(this.state.teacherTalkRatio, { type: "Teacher"}).reverse()}
              displayRatio={true}
              handleClick={() => {}} />
          </div>
          <div className="talk-ratio-visualization">
            <div className="talk-ratio-visualization-chart">
              {this.state.teacherTalkRatio.map((item, index, array) => {
                  return (
                    <TalkRatioSection
                      key={index}
                      data={item}
                      handleTalkRatioSectionClick={this.handleTalkRatioSectionClick.bind(this)} />
                  );
              })}
              <div className="talk-ratio-visualization-divider"></div>
              {this.state.studentTalkRatio.map((item, index, array) => {
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
              : "" }
            </div>
          </div>
          <div className="talk-ratio-legend-student">
            <h3 className="talk-ratio-visualization-heading text-right">
              Student Talk: {formatPercentage(this.calculateSpeakerTotal("Student"), 0)}
            </h3>
            <LegendItemGroup
              labels={displayLegendLabels(this.state.studentTalkRatio, { type: "Student" })}
              displayRatio={true}
              handleClick={() => {}} />
          </div>
        </div>
      )
    }
}
