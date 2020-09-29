import PropTypes from "prop-types";

import React, { Component } from 'react';
import defineInitialStyle from '../turn-taking/defineInitialStyle';

export default class Utterance extends Component {
    handleUtteranceClick(utteranceId) {
        this.props.handleUtteranceClick(utteranceId);
    }

    render() {
        var timeStamp = this.props.timeStamp;
        var utterance = this.props.utterance;
        var activeLabels = this.props.activeLabels;
        var isLineHighlighted = false;

        if (activeLabels) {
            for (var i = 0; i < utterance.utteranceTypes.length; i++) {
                if (activeLabels.includes(utterance.utteranceTypes[i])) {
                    isLineHighlighted = true;
                    break;
                }
            }
        }

        console.log("utterance", utterance);
        return (
          <tr className="script-turn-utterance" data-attr-utterance-id={utterance.id} id={utterance.id} onClick={this.handleUtteranceClick.bind(this, utterance.id)}>
            <td className="script-turn-utterance-timestamp">
              {timeStamp}
            </td>

            {utterance.speakerUtterances.map((utteranceItem, index, utteranceArray) => {
              return (
                <td
                  key={index}
                  className={this.props.canInspect ? "script-turn-utterance-text inspectable" : "script-turn-utterance-text"}
                  style={isLineHighlighted ? defineInitialStyle(utterance) : {}}>
                  {utteranceItem}
                </td>
              );
            })}
          </tr>
        )
    }
}

Utterance.propTypes = {
    utterance: PropTypes.object,
    activeLabels: PropTypes.array,
}
