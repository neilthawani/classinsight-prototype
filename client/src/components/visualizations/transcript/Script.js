import React, { Component } from 'react';
import PropTypes from "prop-types";

import Parser from '../../../data/parser';
import Utterance from './Utterance';
import getElementIdsForFocusWindow from './getElementIdsForFocusWindow';

export default class Script extends Component {
    constructor(props) {
        super(props);
        this.transcript = this.props.data;
        this.shouldHandleScroll = this.props.shouldHandleScroll;

        this.state = {
            topElId: 0,
            bottomElId: 0
        };
    }

    componentDidMount() {
        // conditional here because TurnTaking visualization's Bar calls Script for focusObj drilldown
        if (this.props.handleScroll) {
            window.addEventListener('scroll', this.handleScroll.bind(this));
            this.handleScroll();
        }
    }

    componentWillUnmount() {
        // conditional here because TurnTaking visualization's Bar calls Script for focusObj drilldown
        if (this.props.handleScroll) {
            window.removeEventListener('scroll', this.handleScroll.bind(this));
        }
    }

    handleScroll(event) {
        var { topElId, bottomElId } = getElementIdsForFocusWindow();

        if (!topElId) { // loose equality catches null, undefined
            topElId = this.state.topElId;
        }

        if (!bottomElId) { // loose equality catches null, undefined
            bottomElId = this.state.bottomElId;
        }

        if (topElId > bottomElId) {
            topElId = 0;
        }

        // console.log("Script::handleScroll", topElId, bottomElId);

        this.setState({
            topElId: topElId,
            bottomElId: bottomElId
        });

        // console.log("handleScroll", topElId, bottomElId);
        this.props.handleScroll(topElId, bottomElId);
    }

    render() {
      var focusObj = this.props.focusObj,
          activeTranscript = this.transcript;

      if (focusObj) {
          activeTranscript = Parser.focusTranscript(this.transcript, focusObj, { range: {min: 1, max: 1} });
      }

      return (
        <div className="script-turn-container">
          {activeTranscript.map((turn, index, array) => {
              return (
                <table key={index} className="script-turn">
                  <tbody className="script-turn-rows">
                    <tr className="script-turn-speaker">
                      <td className="script-turn-speaker-timestamp">
                        {turn.initialTime} - {turn.endTime}
                      </td>
                      <td className="script-turn-speaker-text">
                        {turn.speakerPseudonym}
                      </td>
                    </tr>

                    {turn.utterances.map((utterance, jindex, jarray) => {
                        // console.log("utterance", utterance);
                        var hasTimestamp = utterance.timestamp.length > 0;
                        var key = `${utterance}-${jindex}`;
                        var timeStamp = hasTimestamp ? utterance.timestamp : "";

                        return (
                          <Utterance
                            key={key}
                            timeStamp={timeStamp}
                            utterance={utterance}
                            activeLabels={this.props.activeLabels} />
                        );
                    })}
                  </tbody>
                </table>
              );
          })}
        </div>
      )
    }
}

Script.propTypes = {
    data: PropTypes.array.isRequired,
    focusObj: PropTypes.object,
    activeLabels: PropTypes.array,
};
