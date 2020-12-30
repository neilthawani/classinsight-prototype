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
            if (label.value === "Video" && label.percentage === 0) {
                return null;
            }

            return (
              <LegendItem
                key={index}
                label={label}
                activeFilters={this.props.activeFilters}
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
    displayRatio: PropTypes.bool,
    handleClick: PropTypes.func.isRequired,
    activeFilters: PropTypes.array
};
