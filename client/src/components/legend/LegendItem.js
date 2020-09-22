import React, { Component } from 'react';
import PropTypes from "prop-types";

import HoverBox from '../HoverBox';

import formatPercentage from '../../utils/formatPercentage';

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
        return (this.props.activeFilters && !this.props.activeFilters.includes(this.props.label.value)) || !this.props.activeFilters;
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    toggleDefinitionDisplay(label) {
        console.log("toggleDefinitionDisplay", label);
        var activeLabel = this.state.activeLabel === label ? "" : label;
        console.log("activeLabel", activeLabel);
        this.setState({
            activeLabel: activeLabel
        });
    }

    render() {
      var label = this.props.label,
          activeLabel = this.state.activeLabel;

      return (
        <div className="legend-item"
        onMouseOver={this.toggleDefinitionDisplay.bind(this, label)}
        onMouseOut={this.toggleDefinitionDisplay.bind(this, label)}>
          <div
            className="legend-item-key"
            style={this.styles(label, this.isActive())}
            onClick={this.handleClick.bind(this, label)}>
            {this.props.displayRatio ? formatPercentage(label.percentage, 0) : ""}
          </div>
          <span className="legend-item-label">
            {label.text}
          </span>

          {activeLabel ?
          <HoverBox
            label={label}
            activeLabel={activeLabel} />
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
