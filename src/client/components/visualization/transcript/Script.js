import React, { Component } from 'react';
import PropTypes from "prop-types";

import Utterance from './Utterance';

export default class Script extends Component {
    componentDidMount() {
        var url = window.location.href;

        if (url.indexOf("#") > -1) {
            var utteranceId = url.slice(url.indexOf("#") + 1, url.length);

            window.setTimeout(function() {
                window.scrollTo({top: document.getElementById(utteranceId).offsetTop, behavior: 'smooth'});

            }, 1000);
        }

        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.handleScroll();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    getElementIdsForFocusWindow() {
        var scriptTurnContainer = document.getElementsByClassName('script-turn'),
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

        var topElId = 0,
            bottomElId = 0;

        if (elementsInBounds.length) {
            topElId = parseInt(elementsInBounds[0].getAttribute('data-attr-utterance-id'), 10);
            bottomElId = parseInt(elementsInBounds[elementsInBounds.length - 1].getAttribute('data-attr-utterance-id'), 10);
        }

        return {
            topElId: topElId,
            bottomElId: bottomElId
        }
    }

    handleScroll(event) {
        var { topElId, bottomElId } = this.getElementIdsForFocusWindow();

        this.props.handleScroll(topElId, bottomElId);
    }

    handleUtteranceClick(utteranceId) {
        this.props.handleUtteranceClick(utteranceId);
    }

    render() {
      var drilldownFilter = this.props.drilldownFilter,
          activeTranscript = this.props.transcript;

      // for TalkRatio drilldown
      if (drilldownFilter) {
          activeTranscript = this.props.parser.drilldownTranscript({ drilldownFilter: drilldownFilter });
      }

      return (
        <div className="script-turn-container">
          {activeTranscript.map((utterance, index, array) => {
            return (
              <Utterance
                key={index}
                utterance={utterance}
                activeLabels={this.props.activeLabels}
                canInspect={this.props.canInspect}
                handleUtteranceClick={this.handleUtteranceClick.bind(this)} />
            );
          })}
        </div>
      )
    }
}

Script.propTypes = {
    transcript: PropTypes.array.isRequired,
    activeLabels: PropTypes.array,
    focusBox: PropTypes.object,
    handleScroll: PropTypes.func.isRequired
};
