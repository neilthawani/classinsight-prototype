import React, { Component } from 'react';
import PropTypes from "prop-types";
import formatPercentage from '../../../utils/formatPercentage';

export default class TalkRatioSection extends Component {
    formatStyle(item) {
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
      // console.log("item", item);

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
