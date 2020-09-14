import React, { Component } from 'react';

import TranscriptOld from './TranscriptOld';

import LegendButtonGroup from '../legend/LegendButtonGroup';
import displayLegendLabels from '../legend/displayLegendLabels';
import TurnTakingSmall from './turn-taking/TurnTakingSmall';
import Script from './transcript/Script';
import Parser from '../../data/parser';


export default class Transcript extends Component {
  render() {
    return (
      <div className="transcript-visualization-container">
        <div className="transcript-visualization-legend">
          <LegendButtonGroup
            labels={displayLegendLabels({ type: "Teacher"})}
            displayRatio={true} />
          <LegendButtonGroup
            labels={displayLegendLabels({ type: "Student"})}
            displayRatio={true} />
          <LegendButtonGroup
            labels={displayLegendLabels({ type: "Technique"})}
            displayRatio={true} />
        </div>
        <TurnTakingSmall />
        <Script data={Parser.transcript()} />
      </div>
    );
  }
}
