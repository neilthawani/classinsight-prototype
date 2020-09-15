import React, { Component } from 'react';
import PropTypes from "prop-types";


import Parser from '../../../data/parser';
import Utterance from './Utterance';

export default class Script extends Component {
    constructor(props) {
        super(props);
        this.transcript = this.props.data;

        this.state = {
            topElId: 0,
            bottomElId: 0
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        // this.scriptBoundingRect = document.getElementsByClassName("script-turn-container")[0].getBoundingClientRect();
        // this.topCoords = this.scriptBoundingRect.top;
        // this.navbarHeight = document.getElementsByClassName("navbar")[0].clientHeight;
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(event) {
        var navbarHeight = document.getElementsByClassName("navbar")[0].getBoundingClientRect().height; // 75
        var scriptBoundingRect = document.getElementsByClassName("script-turn-container")[0].getBoundingClientRect();
        var scriptBoundingRectDistanceFromWindowTop = scriptBoundingRect.top;
        var topY = scriptBoundingRectDistanceFromWindowTop;

        if (scriptBoundingRectDistanceFromWindowTop < navbarHeight) {
            topY = navbarHeight;
        }

        var middleX = (scriptBoundingRect.right - scriptBoundingRect.left) / 2;
        var bottomY = window.innerHeight - 5;

        var topEl = document.elementFromPoint(middleX, topY);
        // console.log("topElement", topElement);
        var bottomEl = document.elementFromPoint(middleX, bottomY);
        var topElId = topEl.parentElement.getAttribute('data-attr-utterance-id') || this.state.topElId;
        // debugger;
        // var transcriptLastTurn = this.transcript[this.transcript.length - 1].utterances;
        var bottomElId = bottomEl.parentElement.getAttribute('data-attr-utterance-id') || this.state.bottomElId;
        // || transcriptLastTurn[transcriptLastTurn.length - 1].id;
        if (parseInt(topElId, 10) > parseInt(bottomElId, 10)) {
            topElId = 0;
        }

        this.setState({
            topElId: topElId,
            bottomElId: bottomElId
        });


        // console.log("this.props", this.props);
        this.props.handleScroll(topElId, bottomElId);
        // console.log("topElement", topElement, "bottomElement", bottomElement);
        // console.log("elem", elem);
        // let scrollTop = event.srcElement.body.scrollTop,
        //     itemTranslate = Math.min(0, scrollTop/3 - 60);
        //
        // this.setState({
        //   transform: itemTranslate
        // });
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
    activeLabels: PropTypes.array
};
