import React, { Component } from 'react';
import PropTypes from "prop-types";
import LegendButton from './LegendButton';
// import ChevronDownIcon from 'mdi-react/ChevronDownIcon';

export default class LegendGroup extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      var labels = this.props.labels;
      // ,
      //     legendItemType = this.props.legendItemType;

      // <div className="legend-button-container">
      //   <div className="legend-button-dropdown">
      //     onClick={this.toggleExpandedBars.bind(this, "collapsed")}
      //     fff <ChevronDownIcon size="24" />
      //   </div>
      console.log("labels", labels);

      return (
        <div>
        {labels.map((label, index) => {
          // console.log("label", label);
          return (
            <LegendButton key={index} label={label} displayRatio={this.props.displayRatio} />
          );
        })}
        </div>
      );
    }
}

LegendGroup.propTypes = {
    displayRatio: PropTypes.bool,
    labels: PropTypes.array.isRequired,
};
