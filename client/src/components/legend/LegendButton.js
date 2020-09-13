import React, { Component } from 'react';
import PropTypes from "prop-types";
import Parser from '../../data/parser';
import formatPercentage from '../../utils/formatPercentage';

export default class LegendButton extends Component {
    constructor(props) {
        super(props);
        var talkRatios = Parser.talkRatios();
        this.labelWithRatios = talkRatios.filter((ratioObj) => ratioObj.value === this.props.label.value)[0];
    }

    styles(label) {
        return {};
        //     backgroundColor: label.color,
        //     color: label.buttonTextColor
        // }
    }

    render() {
      var label = this.labelWithRatios;
      console.log("label", label);

      return (
        <div className="legend-button" style={this.styles(label)}>
          {label.text} ({formatPercentage(label.percentage, 0)})
        </div>
      );
    }
}

LegendButton.propTypes = {
    label: PropTypes.object.isRequired
}
