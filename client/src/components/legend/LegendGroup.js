import React, { Component } from 'react';
import PropTypes from "prop-types";
import LegendItem from './LegendItem';

export default class LegendGroup extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      var labels = this.props.labels;

      return (
        <div>
        {labels.map((label, index) => {
          return (
            <LegendItem key={index} label={label} />
          );
        })}
        </div>
      );
    }
}

LegendGroup.propTypes = {
    labels: PropTypes.array.isRequired
};
