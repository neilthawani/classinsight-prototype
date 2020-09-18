import React, { Component } from 'react';
import PropTypes from "prop-types";

import Parser from '../../../data/parser';
import Utterance from './Utterance';

export default class Script extends Component {
    constructor(props) {
        super(props);
        this.transcript = this.props.data;
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

    getElementIdsForFocusWindow() {
        if (!this.props.handleScroll) return;
        
        var scriptTurnContainer = document.getElementsByClassName('script-turn-utterance'),
            elementsInBounds = [];

        for (var i = 0; i < scriptTurnContainer.length; i++) {
            var el = scriptTurnContainer[i];

            var elBounds = el.getBoundingClientRect();

            var isElInBounds = elBounds.top >= 0 &&
                elBounds.left >= 0 &&
                elBounds.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                elBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight);

            if (isElInBounds) {
                elementsInBounds.push(el);
            } else if (elementsInBounds.length > 0 && !isElInBounds) {
                break;
            }
        }

        var topElId = parseInt(elementsInBounds[0].getAttribute('data-attr-utterance-id'), 10),
            bottomElId = parseInt(elementsInBounds[elementsInBounds.length - 1].getAttribute('data-attr-utterance-id'), 10);

        return {
            topElId: topElId,
            bottomElId: bottomElId
        }
    }

    handleScroll(event) {
        var { topElId, bottomElId } = this.getElementIdsForFocusWindow();

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
    focusBox: PropTypes.object
};
