import PropTypes from "prop-types";

import React, { Component } from 'react';
import defineInitialStyle from '../turn-taking/defineInitialStyle';

export default class Utterance extends Component {
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

        return (
          <tr className="script-turn-utterance" data-attr-utterance-id={utterance.id}>
            <td className="script-turn-utterance-timestamp">
              {timeStamp}
            </td>

            <td
              className="script-turn-utterance-text"
              style={isLineHighlighted ? defineInitialStyle(utterance) : {}}>
              {utterance.utterance}
            </td>
          </tr>
        )
    }
}

Utterance.propTypes = {
    utterance: PropTypes.object,
    activeLabels: PropTypes.array,
}
