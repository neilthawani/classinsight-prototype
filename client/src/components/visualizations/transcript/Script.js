import React, { Component } from 'react';
import PropTypes from "prop-types";

import Parser from '../../../data/parser';

export default class Script extends Component {
    constructor(props) {
        super(props);
        this.transcript = Parser.transcript();
    }

    render() {
      var focusObj = this.props.focusObj,
          activeTranscript = [];

      if (focusObj) {
          activeTranscript = Parser.focusTranscript(this.transcript, focusObj, { range: {min: 1, max: 1} });
      }

      return (
        <div className="alt-transcript-container">
          {activeTranscript.map((turn, index, array) => {
              return (
                <div key={index} className="transcript-turn-container">
                  <div className="transcript-turn">
                    <div className="transcript-turn-timestamp">
                      <span className="transcript-turn-timestamp-text">
                        {turn.initialTime} - {turn.endTime}
                      </span>
                    </div>
                    <div className="transcript-turn-speaker">
                      {turn.speakerPseudonym}
                    </div>
                  </div>
                  <div className="transcript-turn-utterances">
                    {turn.utterances.map((utterance, jindex, jarray) => {
                        var hasTimestamp = utterance.timestamp.length > 0;

                        return (
                          <div key={`${utterance}-${jindex}`} className="transcript-turn-utterance">
                            <div className="transcript-turn-utterance-timestamp">
                              <span className="transcript-turn-utterance-timestamp-text">
                                {hasTimestamp ? utterance.timestamp : ""}
                              </span>
                            </div>
                            <span
                              className="transcript-turn-utterance-text"
                              data-attr-type={utterance.utteranceType}>
                              {utterance.utterance}
                            </span>
                          </div>
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
