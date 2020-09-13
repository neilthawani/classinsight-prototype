import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class LegendButton extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      var label = this.props.label;

      return (
        <div className="legend-item">
          <div className="legend-item-key" style={{backgroundColor: label.color}}></div>
          <span className="legend-item-label">
            {label.text}
          </span>
        </div>
      );
    }
}

LegendButton.propTypes = {
    label: PropTypes.object.isRequired
}
