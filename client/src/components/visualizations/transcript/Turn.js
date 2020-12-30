import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class HoverScript extends Component {
    handleTextClick(turnId) {
        this.props.handleTextClick(turnId);
    }

    render() {
        var turn = this.props.data;
        var utteranceId = `utterance${turn.id}`

        return (
          <div className="script-turn-container" id={utteranceId} onClick={this.handleTextClick.bind(this, utteranceId)}>
            <table className="script-turn">
              <tbody className="script-turn-rows">
                <tr className="script-turn-speaker">
                  <td className="script-turn-speaker-text">
                    {turn.speakerPseudonym}
                  </td>
                </tr>

                {turn.speakerUtterances.map((utterance, jindex, jarray) => {
                    return (
                      <tr key={jindex} className="script-turn-utterance">
                        <td className={this.props.canInspect ? "script-turn-utterance-text inspectable" : "script-turn-utterance-text"}>
                          {utterance}
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        )
    }
}

HoverScript.propTypes = {
    data: PropTypes.object.isRequired
};
