import React, { Component } from 'react';
import PropTypes from "prop-types";
import LegendButton from './LegendButton';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import ChevronUpIcon from 'mdi-react/ChevronUpIcon';

export default class LegendGroup extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isCollapsed: false
      };
    }

    toggleGroup(isCollapsed) {
        this.setState({ isCollapsed: !isCollapsed });
    }

    render() {
      var isCollapsed = this.state.isCollapsed,
          labels = this.props.labels;

      return (
        <div className="legend-button-container">
          <div className={isCollapsed ? "legend-button-dropdown collapsed" : "legend-button-dropdown"} onClick={this.toggleGroup.bind(this, this.state.isCollapsed)}>
            <span className="legend-button-dropdown-text">{labels[0].type}</span>
            {isCollapsed ?
              <ChevronUpIcon className="legend-button-dropdown-toggle" size="24" /> :
              <ChevronDownIcon className="legend-button-dropdown-toggle" size="24" /> }
          </div>
          <div className="legend-buttons">
            {labels.map((label, index) => {
              // console.log("label", label);
              return (
                <LegendButton key={index} label={label} displayRatio={this.props.displayRatio} />
              );
            })}
          </div>
        </div>
      );
    }
}

LegendGroup.propTypes = {
    displayRatio: PropTypes.bool,
    labels: PropTypes.array.isRequired,
};
