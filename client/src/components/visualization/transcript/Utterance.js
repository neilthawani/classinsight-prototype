import PropTypes from "prop-types";

import React, { Component } from 'react';
import defineInitialStyle from '../turn-taking/defineInitialStyle';

export default class Utterance extends Component {
    handleUtteranceClick(utteranceId) {
        this.props.handleUtteranceClick(utteranceId);
    }

    render() {
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

        // console.log("utterance.timestamp", utterance.timestamp);
        var hasTimestamp = utterance.timestamp && utterance.timestamp.length > 0;
        var timeStamp = hasTimestamp ? utterance.timestamp : "";

        return (
          <table className="script-turn">
            <tbody className="script-turn-rows">
              <tr className="script-turn-speaker">
                <td className="script-turn-speaker-timestamp">
                  {timeStamp}
                </td>
                <td className="script-turn-speaker-text">
                  {utterance.speakerPseudonym}
                </td>
              </tr>
              <tr className="script-turn-utterance" data-attr-utterance-id={utterance.id} id={utterance.id} onClick={this.handleUtteranceClick.bind(this, utterance.id)}>
                <td
                  className={this.props.canInspect ? "script-turn-utterance-text inspectable" : "script-turn-utterance-text"}
                  style={isLineHighlighted ? defineInitialStyle(utterance) : {}}>
                  {utterance.utterance}
                </td>
              </tr>
            </tbody>
          </table>
        )
    }
}

Utterance.propTypes = {
    utterance: PropTypes.object,
    activeLabels: PropTypes.array,
}
