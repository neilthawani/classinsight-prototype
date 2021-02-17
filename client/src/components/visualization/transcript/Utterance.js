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
            var index = activeLabels.findIndex(item => {
                // console.log("item", item, "value", value);
                // debugger;
                // console.log("item.speakerType === value.speakerType && item.code === value.code", item.speakerType === value.speakerType && item.code === value.code);
                return item.speakerType === utterance.speakerType && utterance.utteranceCodes.includes(item.code);
            });

            if (index > -1) {
                isLineHighlighted = true;
            }

            // for (var i = 0; i < utterance.utteranceTypes.length; i++) {
            //     if (activeLabels.includes(utterance.utteranceTypes[i])) {
            //         isLineHighlighted = true;
            //         break;
            //     }
            // }
        }

        // console.log("utterance.timestamp", utterance.timestamp);
        var hasTimestamp = utterance.timestamp && utterance.timestamp.length > 0;
        var timeStamp = hasTimestamp ? utterance.timestamp : "";

        return (
          <div className="script-turn" data-attr-utterance-id={utterance.id} id={utterance.id} onClick={this.handleUtteranceClick.bind(this, utterance.id)}>
            {/*<tbody className="script-turn-rows">*/}
              {/*<tr className="script-turn-speaker">*/}
                <span className="script-turn-speaker-timestamp">
                  {timeStamp}
                </span>
                <span>
                  {utterance.speakerPseudonym}
                </span>
              {/*</tr>*/}
              {/*<tr className="script-turn-utterance">*/}
                <p
                  className={this.props.canInspect ? "script-turn-utterance-text inspectable" : "script-turn-utterance-text"}
                  style={isLineHighlighted ? defineInitialStyle(utterance) : {}}>
                  {utterance.utterance}
                </p>
              {/*</tr>*/}
            {/*</tbody>*/}
          </div>
        )
    }
}

Utterance.propTypes = {
    utterance: PropTypes.object,
    activeLabels: PropTypes.array,
}
