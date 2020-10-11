import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline, mdiBarcode, mdiChartGantt, mdiCommentTextMultipleOutline } from '@mdi/js';

export default class ButtonSelector extends Component {
    // constructor(props) {
    //     super(props);
    //     console.log("props");
    // }

    handleClick(value) {
        this.props.handleClick(value);
    }

    render() {
        return (
          <div className="button-selector">
            <Link
              className={this.props.selectedOption === "dashboard" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="dashboard"
              to="/dashboard"
              onClick={this.handleClick.bind(this, "dashboard")}>
              <Icon path={mdiViewDashboardVariantOutline} className="button-selector-item-icon" size={1} />
              <span className="button-selector-item-text">
                Dashboard
              </span>
            </Link>

            <Link
              className={this.props.selectedOption === "talk-ratio" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="talk-ratio"
              to="/dashboard/talk-ratio"
              onClick={this.handleClick.bind(this, "talk-ratio")}>
              {/*<ViewSplitHorizontalIcon className="button-selector-item-icon mdi-rotate-90" />
              <ViewSplitHorizontalIcon className="button-selector-item-icon mdi-rotate-270" />*/}
              <Icon path={mdiBarcode} className="button-selector-item-icon" size={1.5} />

              <span className="button-selector-item-text">
                Talk Ratio
              </span>
            </Link>

            <Link
              className={this.props.selectedOption === "turn-taking" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="turn-taking"
              to="/dashboard/turn-taking"
              onClick={this.handleClick.bind(this, "turn-taking")}>
              <Icon path={mdiChartGantt} className="button-selector-item-icon" size={1} />
              <span className="button-selector-item-text">
                Turn Taking
              </span>
            </Link>

            <Link
              className={this.props.selectedOption === "transcript" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="transcript"
              to="/dashboard/transcript"
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
    selectedOption: PropTypes.string.isRequired
}
