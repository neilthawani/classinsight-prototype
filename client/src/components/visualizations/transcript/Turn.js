import React, { Component } from 'react';
import PropTypes from "prop-types";
import { NavLink } from 'react-router-dom'

export default class HoverScript extends Component {
    render() {
        var turn = this.props.data;
        // console.log("turn", turn);

        return (
          <div className="script-turn-container" id={turn.id}>
            <NavLink to="/dashboard/transcript#34"> Dashboard </NavLink>
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
                        <td className="script-turn-utterance-text">{utterance}</td>
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
