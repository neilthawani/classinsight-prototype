import React, { Component } from 'react';
import PropTypes from "prop-types";
import formatPercentage from '../../../utils/formatPercentage';

export default class TalkRatioSection extends Component {
    constructor(props) {
        super(props);
        this.item = this.props.data;
    }

    formatStyle(item) {
        return {
            height: "50px",
            width: formatPercentage(item.percentage, 2, false),
            backgroundColor: item.barColor
        }
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    render() {
      var item = this.item;

      return (
        <div
          className="talk-ratio-visualization-section"
          style={this.formatStyle(item)}
          onClick={this.props.handleClick.bind(this, item)}>
        </div>
      );
    }
}

TalkRatioSection.propTypes = {
    data: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
};
