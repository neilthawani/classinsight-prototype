import React, { Component } from 'react';

import TalkRatioSection from './TalkRatioSection';
import Script from '../transcript/Script';
import LegendItemGroup from '../../legend/LegendItemGroup';

import formatPercentage from '../../../utils/formatPercentage';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

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
        // console.log("speakerTalkTotals", speakerTalkTotals);
        var speakerTotalObj = speakerTalkTotals.filter((item) => item.speakerType === type);
        // console.log("speakerTotalObj", speakerTotalObj);
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
              {/*<LegendItemGroup
                labels={parser.legendLabels({ type: "Media" })}
                displayRatio={true}
                handleClick={() => {}} />*/}
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
