import React, { Component } from 'react';
import PropTypes from "prop-types";
import LegendButton from './LegendButton';

import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

export default class LegendButtonGroup extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isCollapsed: false
      };
    }

    toggleGroup(isCollapsed) {
        this.setState({ isCollapsed: !isCollapsed });
    }

    handleClick(label) {
        this.props.handleClick(label);
    }

    render() {
      var isCollapsed = this.state.isCollapsed,
          labels = this.props.labels;

      return (
        <div className="legend-button-container">
          <div className={isCollapsed ? "legend-button-dropdown collapsed" : "legend-button-dropdown"} onClick={this.toggleGroup.bind(this, this.state.isCollapsed)}>
            <span className="legend-button-dropdown-text">{labels[0].type}</span>
            {isCollapsed ?
              <Icon path={mdiChevronUp} className="legend-button-dropdown-toggle" size={1} /> :
              <Icon path={mdiChevronDown} className="legend-button-dropdown-toggle" size={1} />}
          </div>
          <div className="legend-buttons">
            {labels.map((label, index) => {
                if (label.value === "Video" && label.percentage === 0) {
                    return null;
                }

                return (
                  <LegendButton
                    key={index}
                    label={label}
                    displayRatio={this.props.displayRatio}
                    activeLabels={this.props.activeLabels}
                    handleClick={this.handleClick.bind(this, label)} />
                );
            })}
          </div>
        </div>
      );
    }
}

LegendButtonGroup.propTypes = {
    handleClick: PropTypes.func,
    displayRatio: PropTypes.bool,
    labels: PropTypes.array.isRequired,
    activeLabels: PropTypes.array
};
