import React, { Component } from 'react';
import PropTypes from "prop-types";

import formatPercentage from '../../utils/formatPercentage';

export default class LegendItem extends Component {
    styles(label) {
        return {
            backgroundColor: label.barColor,
            color: label.textColor
        };
    }

    render() {
      var label = this.props.label;

      return (
        <div className="legend-item">
          <div className="legend-item-key" style={this.styles(label)}>{this.props.displayRatio ? formatPercentage(label.percentage, 0) : ""}</div>
          <span className="legend-item-label">
            {label.text}
          </span>
        </div>
      );
    }
}

LegendItem.propTypes = {
    label: PropTypes.object.isRequired,
    displayRatio: PropTypes.bool
};
