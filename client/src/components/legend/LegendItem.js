import React, { Component } from 'react';
import PropTypes from "prop-types";

import HoverBox from './HoverBox';

import formatPercentage from '../../utils/formatPercentage';

import { filtersIncludeLabel } from './labelFilters';

export default class LegendItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLabel: {}
        };
    }
    styles(label, isActive = true) {
        return {
            backgroundColor: this.isActive() ? label.barColor : "transparent",
            color: label.textColor
        };
    }

    isActive() {
        var isActive = (this.props.activeFilters && !filtersIncludeLabel(this.props.activeFilters, this.props.label)) || !this.props.activeFilters;


        return isActive;
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    toggleDefinitionDisplay(label) {
        var activeLabel = this.state.activeLabel === label ? "" : label;

        this.setState({
            activeLabel: activeLabel
        });
    }

    render() {
      var label = this.props.label,
          activeLabel = this.state.activeLabel;

      return (
        <div className="legend-item">
          <div
            className="legend-item-key"
            style={this.styles(label, this.isActive())}
            onClick={this.handleClick.bind(this, label)}>
            {this.props.displayRatio ? formatPercentage(label.percentage, 0) : ""}
          </div>
          <span className="legend-item-label"
          onMouseOver={this.toggleDefinitionDisplay.bind(this, label)}
          onMouseOut={this.toggleDefinitionDisplay.bind(this, label)}>
            {label.value}
          </span>

          {activeLabel ?
          <HoverBox
            label={label}
            activeLabel={activeLabel}
            width={200}
            height="max-content" />
          : ""}
        </div>
      );
    }
}

LegendItem.propTypes = {
    label: PropTypes.object.isRequired,
    displayRatio: PropTypes.bool,
    handleClick: PropTypes.func.isRequired
};
