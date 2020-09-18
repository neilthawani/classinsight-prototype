import React, { Component } from 'react';
import PropTypes from "prop-types";
import LegendItem from './LegendItem';

export default class LegendItemGroup extends Component {
    handleClick(value) {
        this.props.handleClick(value);
    }

    render() {
      var labels = this.props.labels;

      return (
        <div>
        {labels.map((label, index) => {
          return (
            <LegendItem
              key={index}
              label={label}
              displayRatio={this.props.displayRatio}
              handleClick={this.handleClick.bind(this) }/>
          );
        })}
        </div>
      );
    }
}

LegendItemGroup.propTypes = {
    labels: PropTypes.array.isRequired,
    displayRatio: PropTypes.bool
};
