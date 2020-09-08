import React, { Component } from 'react';

import data from '../../../data/data';

export default class Script extends Component {
    constructor(props) {
        super(props);
        var transcriptData = data,
            transcript = [];

        var segments = transcriptData[0].data.segments;
        segments.forEach((segment, index, array) => {
            var speakingTurns = segment.speaking_turns;
            speakingTurns.forEach((turn, jindex, jarray) => {
                var speaker = turn.speaker_pseudonym;
                var start = turn.initial_time;
                var end = turn.end_time;

                transcript.push({speaker: speaker, start: start, end: end, utterances: []})

                turn.utterances.forEach((utterance, kindex, karray) => {
                    var utteranceType = utterance.utterance_type.length === 0 ? ["Unknown"] : utterance.utterance_type;

                    transcript[transcript.length - 1].utterances.push({
                        timestamp: utterance.timestamp,
                        utterance: utterance.utterance,
                        type: utteranceType
                    });
                });
            });
        });

        this.transcript = transcript;
    }

    render() {
      return (
        <div className="alt-transcript-container">
          {this.transcript.map((turn, index, array) => {
              var speaker = turn.speaker;

              return (
                <div key={index} className="transcript-turn">
                  <div className="transcript-turn-speaker">
                    {speaker}
                  </div>
                  <div className="transcript-turn-utterances">
                    {turn.utterances.map((utterance, jindex, jarray) => {
                        return (
                          <span key={`${utterance}-${jindex}`}
                            className="transcript-turn-utterance"
                            data-attr-type={utterance.type}>
                            {utterance.utterance}
                          </span>
                        );
                    })}
                  </div>
                </div>
              );
          })}
        </div>
      )
    }
}
