import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline, mdiBarcode, mdiChartGantt, mdiCommentTextMultipleOutline } from '@mdi/js';

export default class ButtonSelector extends Component {
    handleClick(value) {
        this.props.handleClick(value);
    }

    render() {
        return (
          <div className="button-selector">
            <Link
              className={this.props.buttonSelectorSelectedOption === "dashboard" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="dashboard"
              to="/dashboard"
              onClick={this.handleClick.bind(this, "dashboard")}>
              <Icon path={mdiViewDashboardVariantOutline} className="button-selector-item-icon" size={1} />
              <span className="button-selector-item-text">
                Dashboard
              </span>
            </Link>

            <Link
              className={this.props.buttonSelectorSelectedOption === "talk-ratio" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="talk-ratio"
              to="/talk-ratio"
              onClick={this.handleClick.bind(this, "talk-ratio")}>
              <Icon path={mdiBarcode} className="button-selector-item-icon" size={1.5} />

              <span className="button-selector-item-text">
                Talk Ratio
              </span>
            </Link>

            <Link
              className={this.props.buttonSelectorSelectedOption === "turn-taking" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="turn-taking"
              to="/turn-taking"
              onClick={this.handleClick.bind(this, "turn-taking")}>
              <Icon path={mdiChartGantt} className="button-selector-item-icon" size={1} />
              <span className="button-selector-item-text">
                Turn Taking
              </span>
            </Link>

            <Link
              className={this.props.buttonSelectorSelectedOption === "transcript" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="transcript"
              to="/transcript"
              onClick={this.handleClick.bind(this, "transcript")}>
              <Icon path={mdiCommentTextMultipleOutline} className="button-selector-item-icon" size={1} />
              <span className="button-selector-item-text">
                Transcript
              </span>
            </Link>
          </div>
        );
    }
}

ButtonSelector.propTypes = {
    buttonSelectorSelectedOption: PropTypes.string.isRequired
}
