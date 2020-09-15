import React, { Component } from 'react';
import PropTypes from "prop-types";


import Parser from '../../../data/parser';
import Utterance from './Utterance';

export default class Script extends Component {
    constructor(props) {
        super(props);
        this.transcript = this.props.data;
    }

    render() {
      var focusObj = this.props.focusObj,
          activeTranscript = this.transcript;

      if (focusObj) {
          activeTranscript = Parser.focusTranscript(this.transcript, focusObj, { range: {min: 1, max: 1} });
      }

      return (
        <div className="script-container">
          {activeTranscript.map((turn, index, array) => {
              return (
                <div key={index} className="transcript-turn-container">
                  <div className="transcript-turn">
                    <div className="transcript-turn-timestamp">
                      <span className="transcript-turn-timestamp-text">
                        {turn.initialTime} - {turn.endTime}
                      </span>
                    </div>
                    <span className="transcript-turn-speaker">
                      {turn.speakerPseudonym}
                    </span>
                  </div>
                  <div className="transcript-turn-utterances">
                    {turn.utterances.map((utterance, jindex, jarray) => {
                        var hasTimestamp = utterance.timestamp.length > 0;
                        var key = `${utterance}-${jindex}`;
                        var timeStamp = hasTimestamp ? utterance.timestamp : "";
                        // if (Object.keys(activeStyle).length > 0)
                        // console.log("utterance", utterance, "utterance.type", utterance.type);
                        // console.log("activeStyle", this.props.activeLabels.includes(utterance.type));
                        return (
                          <Utterance
                            key={key}
                            timeStamp={timeStamp}
                            utterance={utterance}
                            activeLabels={this.props.activeLabels} />
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
    data: PropTypes.array.isRequired,
    focusObj: PropTypes.object,
    activeLabels: PropTypes.array
};
