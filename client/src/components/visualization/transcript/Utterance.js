import PropTypes from "prop-types";

import React, { Component } from 'react';
import { defineInitialStyle } from '../turn-taking/barStyles';
import { utteranceMatchesLabel } from '../../legend/labelFilters';

export default class Utterance extends Component {
    handleUtteranceClick(utteranceId) {
        this.props.handleUtteranceClick(utteranceId);
    }

    render() {
        var utterance = this.props.utterance;
        var activeLabels = this.props.activeLabels;
        var isLineHighlighted = false;

        if (activeLabels) {
            var index = activeLabels.findIndex(item => {
                return utteranceMatchesLabel(utterance, item);
            });

            if (index > -1) {
                isLineHighlighted = true;
            }
        }

        var hasTimestamp = utterance.timestamp && utterance.timestamp.length > 0;
        var timeStamp = hasTimestamp ? utterance.timestamp : "";

        return (
          <div className="script-turn" data-attr-utterance-id={utterance.id} id={utterance.id} onClick={this.handleUtteranceClick.bind(this, utterance.id)}>
            <span className="script-turn-speaker-timestamp" style={timeStamp ? {marginRight: "10px"} : {}}>
              {timeStamp}
            </span>
            <span>
              {utterance.speakerPseudonym}
            </span>
            <p
              className={this.props.canInspect ? "script-turn-utterance-text inspectable" : "script-turn-utterance-text"}
              style={isLineHighlighted ? defineInitialStyle(utterance) : {}}>
              {utterance.utterance}
            </p>
          </div>
        )
    }
}

Utterance.propTypes = {
    utterance: PropTypes.object,
    activeLabels: PropTypes.array,
}
