import React, { Component } from 'react';
import defineInitialStyle from '../turn-taking/defineInitialStyle';

export default class Utterance extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var timeStamp = this.props.timeStamp;
        var utterance = this.props.utterance;
        var isLineHighlighted = false;
        for (var i = 0; i < utterance.utteranceTypes.length; i++) {
            if (this.props.activeLabels.includes(utterance.utteranceTypes[i])) {
                isLineHighlighted = true;
                break;
            }
        }

        return (
          <div className="transcript-turn-utterance">
            <div className="transcript-turn-utterance-timestamp">
              <span className="transcript-turn-utterance-timestamp-text">
                {timeStamp}
              </span>
            </div>

            <span
              className="transcript-turn-utterance-text"
              style={isLineHighlighted ? defineInitialStyle(utterance) : {}}>
              {utterance.utterance}
            </span>
          </div>
        )
    }
}
