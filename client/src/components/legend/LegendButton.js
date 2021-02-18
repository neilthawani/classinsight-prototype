import React, { Component } from 'react';
import PropTypes from "prop-types";
import { filtersIncludeLabel } from './labelFilters';

import formatPercentage from '../../utils/formatPercentage';

export default class LegendButton extends Component {
    styles(label) {
        var styles = {};

        if (filtersIncludeLabel(this.props.activeLabels, label)) {
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
          {label.value} {this.props.displayRatio ? `(${formatPercentage(label.percentage, 0)})` : ""}
        </div>
      );
    }
}

LegendButton.propTypes = {
    label: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    activeLabels: PropTypes.array
};
