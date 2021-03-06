import React, { Component } from 'react';
import PropTypes from "prop-types";
import formatPercentage from '../../../utils/formatPercentage';

export default class TalkRatioSection extends Component {
    formatStyle(item) {
        // console.log('item.percentage', item.percentage);
        if (item.percentage < 0.01 && item.percentage > 0) {
            // console.log('item.percentage', item.percentage);
            item = {
              ...item,
              percentage: 0.01
            };
        }
        // console.log('fixed?', item.percentage);
        return {
            width: formatPercentage(item.percentage, 2, false),
            backgroundColor: item.barColor
        }
    }

    handleTalkRatioSectionClick(value) {
        this.props.handleTalkRatioSectionClick(value);
    }

    render() {
      var item = this.props.data;

      return (
        <div
          className={item.percentage > 0 ? "talk-ratio-visualization-section" : ""}
          style={this.formatStyle(item)}
          onClick={this.props.handleTalkRatioSectionClick.bind(this, item)}>
        </div>
      );
    }
}

TalkRatioSection.propTypes = {
    data: PropTypes.object.isRequired,
    handleTalkRatioSectionClick: PropTypes.func.isRequired,
};
