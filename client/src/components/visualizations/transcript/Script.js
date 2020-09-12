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
              var speakerPseudonym = turn.speakerPseudonym;

              return (
                <div key={index} className="transcript-turn">
                  <div className="transcript-turn-speaker">
                    {speakerPseudonym}
                  </div>
                  <div className="transcript-turn-utterances">
                    {turn.utterances.map((utterance, jindex, jarray) => {
                        return (
                          <span key={`${utterance}-${jindex}`}
                            className="transcript-turn-utterance"
                            data-attr-type={utterance.utteranceType}>
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
