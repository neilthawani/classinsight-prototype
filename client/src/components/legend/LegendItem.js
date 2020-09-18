import React, { Component } from 'react';
import PropTypes from "prop-types";

import formatPercentage from '../../utils/formatPercentage';

export default class LegendItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: true
        };
    }
    styles(label, isActive = true) {
        return {
            backgroundColor: isActive ? label.barColor : "transparent",
            color: label.textColor
        };
    }

    handleClick(value) {
        this.setState({
            isActive: !this.state.isActive
        });

        this.props.handleClick(value);
    }

    render() {
      var label = this.props.label;

      return (
        <div className="legend-item">
          <div
            className="legend-item-key"
            style={this.styles(label, this.state.isActive)}
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
    displayRatio: PropTypes.bool
};
