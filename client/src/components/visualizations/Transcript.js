import React, { Component } from 'react';

import TranscriptOld from './TranscriptOld';

import LegendButtonGroup from '../legend/LegendButtonGroup';
import displayLegendLabels from '../legend/displayLegendLabels';
import TurnTakingSmall from './turn-taking/TurnTakingSmall';
import Script from './transcript/Script';
import Parser from '../../data/parser';

import removeArrayValue from '../../utils/removeArrayValue';

export default class Transcript extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLabels: []
        };
    }

    handleClick(label) {
        var activeLabels = this.state.activeLabels,
            newLabels = activeLabels.includes(label.value) ?
                        removeArrayValue(label.value, activeLabels) :
                        activeLabels.push(label.value);

        this.setState({
            activeLabels: activeLabels
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

          <TurnTakingSmall />

          <Script
            data={Parser.transcript()}
            activeLabels={this.state.activeLabels} />
        </div>
      );
    }
}
