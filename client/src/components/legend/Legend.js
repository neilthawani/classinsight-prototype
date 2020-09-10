import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class Legend extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      var labels = this.props.labels;

      return (
        <div>
        {labels.map((label, index) => {
          return (
            <div key={index} className="legend-item">
              <div className="legend-item-key" style={{backgroundColor: label.color}}></div>
              <span className="legend-item-label">
                {label.text}
              </span>
            </div>
          );
        })}
        </div>
      );
    }
}

Legend.propTypes = {
    labels: PropTypes.array.isRequired
};
