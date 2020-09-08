import React, { Component } from 'react';
import PropTypes from "prop-types";

import data from '../../../data/data';
import Parser from '../../../data/parser';

export default class Script extends Component {
    constructor(props) {
        super(props);
        var transcriptData = data,
            transcript = [];

        var segments = transcriptData[0].data.segments;
        segments.forEach((segment, index, array) => {
            var utteranceIndex = 0;

            if (segment.participation_type !== "Other") {
                var speakingTurns = segment.speaking_turns;
                speakingTurns.forEach((turn, jindex, jarray) => {
                    var speaker = turn.speaker_pseudonym;
                    var start = turn.initial_time;
                    var end = turn.end_time;

                    transcript.push({speaker: speaker, start: start, end: end, utterances: []})

                    turn.utterances.forEach((utterance, kindex, karray) => {
                        var utteranceType = utterance.utterance_type.length === 0 ? ["Unknown"] : utterance.utterance_type;

                        transcript[transcript.length - 1].utterances.push({
                            id: utteranceIndex++,
                            timestamp: utterance.timestamp,
                            utterance: utterance.utterance,
                            type: utteranceType
                        });
                    });
                });
            }
        });

        this.transcript = transcript;
    }

    render() {
      var focusObj = this.props.focusObj,
          activeTranscript = [];

      if (focusObj) {
          // begin parser::focusTranscript
          activeTranscript = Parser.focusTranscript(this.transcript, focusObj, { range: {min: 1, max: 1} });
          debugger;
          // var activeTurnIndex = 0;
          //
          // for (var i = 0; i < this.transcript.length; i++) {
          //     var turn = this.transcript[i];
          //     var utteranceIndex = turn.utterances.findIndex((utteranceObj) => {
          //         return utteranceObj.id === focusObj.id && utteranceObj.utterance === focusObj.utterance;
          //     });
          //
          //     if (utteranceIndex !== -1 ) {
          //         activeTurnIndex = i;
          //         break;
          //     }
          // }
          //
          // focusTranscript = this.transcript.slice(activeTurnIndex - 1, activeTurnIndex + 2);
          // end parser::focusTranscript
      }
      console.log("Script::activeTranscript", activeTranscript);

      return (
        <div className="alt-transcript-container">
          {activeTranscript.map((turn, index, array) => {
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

Script.propTypes = {
    focusObj: PropTypes.object
};
