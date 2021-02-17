import React, { Component } from 'react';
import PropTypes from "prop-types";

import formatPercentage from '../../utils/formatPercentage';

export default class LegendButton extends Component {
    styles(label) {
        var styles = {};
        var index = this.props.activeLabels.findIndex(item => {
            // console.log("item", item, "value", value);
            // debugger;
            // console.log("item.speakerType === value.speakerType && item.code === value.code", item.speakerType === value.speakerType && item.code === value.code);
            return item.speakerType === label.speakerType && label.code === item.code;
        });

        if (index > -1) {
            styles = {
                backgroundColor: label.barColor,
                color: label.textColor
            };
        }

        // if (this.props.activeLabels.includes(label.value)) {
        //     styles = {
        //         backgroundColor: label.barColor,
        //         color: label.textColor
        //     };
        // }

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
};
