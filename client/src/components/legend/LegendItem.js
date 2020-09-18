import React, { Component } from 'react';
import PropTypes from "prop-types";

import formatPercentage from '../../utils/formatPercentage';

export default class LegendItem extends Component {
    constructor(props) {
        super(props);
    }
    styles(label, isActive = true) {
        return {
            backgroundColor: this.isActive() ? label.barColor : "transparent",
            color: label.textColor
        };
    }

    isActive() {
        return this.props.activeFilters && !this.props.activeFilters.includes(this.props.label.value);
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    render() {
      var label = this.props.label;

      return (
        <div className="legend-item">
          <div
            className="legend-item-key"
            style={this.styles(label, this.isActive())}
            onClick={this.handleClick.bind(this, label)}>
            {this.props.displayRatio ? formatPercentage(label.percentage, 0) : ""}
          </div>
          <span className="legend-item-label">
            {label.text}
          </span>
        </div>
      );
    }
}

LegendItem.propTypes = {
    label: PropTypes.object.isRequired,
    displayRatio: PropTypes.bool,
    handleClick: PropTypes.func.isRequired
};
