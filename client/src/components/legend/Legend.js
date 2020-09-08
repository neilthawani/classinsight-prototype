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
            <div key={index} className="turn-taking-key-item">
              <div className="turn-taking-key-item-legend" style={{backgroundColor: label.color}}></div>
              <span className="turn-taking-key-item-text">
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
