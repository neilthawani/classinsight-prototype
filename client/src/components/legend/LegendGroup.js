import React, { Component } from 'react';
import PropTypes from "prop-types";
import LegendItem from './LegendItem';
import LegendButton from './LegendButton';

export default class LegendGroup extends Component {
    constructor(props) {
      super(props);
    }

    renderLegendItem(legendItemType, label, index) {
        switch(legendItemType) {
          case "key":
            return <LegendItem key={index} label={label} />
          case "button":
            return <LegendButton key={index} label={label} />
          default:
            break;
        }
    }

    render() {
      var labels = this.props.labels,
          legendItemType = this.props.legendItemType;

      return (
        <div>
        {labels.map((label, index) => {
          return (
            this.renderLegendItem(legendItemType, label, index)
          );
        })}
        </div>
      );
    }
}

LegendGroup.propTypes = {
    labels: PropTypes.array.isRequired,
    legendItemType: PropTypes.string.isRequired
};
