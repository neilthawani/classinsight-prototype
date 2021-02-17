import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class HoverScript extends Component {
    handleTextClick(turnId) {
        this.props.handleTextClick(turnId);
    }

    render() {
        var turn = this.props.data;
        // console.log("turn", turn);

        return (
          <div className="script-turn-container" id={turn.id} onClick={this.handleTextClick.bind(this, turn.id)}>
            <table className="script-turn">
              <tbody className="script-turn-rows">
                <tr className="script-turn-speaker">
                  <td className="script-turn-speaker-text">
                    {turn.speakerPseudonym}
                  </td>
                </tr>

                {/*{turn.speakerUtterances.map((utterance, jindex, jarray) => {*/}
                    {/*return (*/}
                      <tr className="script-turn-utterance">
                        <td className={this.props.canInspect ? "script-turn-utterance-text inspectable" : "script-turn-utterance-text"}>
                          {turn.utterance}
                        </td>
                      </tr>
                    {/*);*/}
                {/*})}*/}
              </tbody>
            </table>
          </div>
        )
    }
}

HoverScript.propTypes = {
    data: PropTypes.object.isRequired
};
