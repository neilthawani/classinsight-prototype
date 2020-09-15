import React, { Component } from 'react';
import PropTypes from "prop-types";
// import Parser from '../../data/parser';
import formatPercentage from '../../utils/formatPercentage';

export default class LegendButton extends Component {
    constructor(props) {
        super(props);
    }

    styles(label) {
        var styles = {};
        if (this.props.activeLabels.includes(label.value)) {
            styles = {
                backgroundColor: label.barColor,
                color: label.textColor
            };
        }

        return styles;
    }

    handleClick(label) {
        this.props.handleClick(label);
    }

    render() {
      var label = this.props.label;

      return (
        <div className="legend-button" style={this.styles(label)} onClick={this.handleClick.bind(this, label)}>
          {label.text} {this.props.displayRatio ? `(${formatPercentage(label.percentage, 0)})` : ""}
        </div>
      );
    }
}

LegendButton.propTypes = {
    label: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    activeLabels: PropTypes.array
}
