import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import dashboardRoutes from '../fixtures/dashboardRoutes';

class ButtonSelector extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname.slice(1) !== nextProps.buttonSelectorSelectedOption) {
            this.handleClick(nextProps.location.pathname.slice(1));
        }

        return true;
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    // dashboardRoutePaths = ["/dashboard", "/talk-ratio", "/turn-taking", "/transcript"];

    render() {
        // console.log("this.props.admin", this.props.admin);
        // var isAdmin = this.props.admin ? Object.keys(this.props.admin).length > 0 : false;
            // linkToPaths = isAdmin ? this.props.admin.paths.map(pathObj => pathObj.path) : this.dashboardRoutePaths;

        return (
          <div className="button-selector">
            <div className="button-selector-options">
              {dashboardRoutes.paths.map((path, index, array) => {
                  var pathName = path.slice(1);
                  // console.log("dashboardRoutes.definitions", dashboardRoutes.definitions);
                  return (
                    <Link
                      key={index}
                      className={this.props.buttonSelectorSelectedOption === pathName ? "button-selector-item active" : "button-selector-item"}
                      data-attr-name={pathName}
                      to={dashboardRoutes.definitions()[index].path}
                      onClick={this.handleClick.bind(this, pathName)}>

                      {dashboardRoutes.definitions()[index].icon}

                      <span className="button-selector-item-text">
                        {dashboardRoutes.definitions()[index].label}
                      </span>
                    </Link>
                  );
              })}

              {/*<Link
                className={this.props.buttonSelectorSelectedOption === "talk-ratio" ? "button-selector-item active" : "button-selector-item"}
                data-attr-name="talk-ratio"
                to={linkToPaths[1]}
                onClick={this.handleClick.bind(this, "talk-ratio")}>
                <Icon path={mdiBarcode} className="button-selector-item-icon" size={1.5} />

                <span className="button-selector-item-text">
                  Talk Ratio
                </span>
              </Link>

              <Link
                className={this.props.buttonSelectorSelectedOption === "turn-taking" ? "button-selector-item active" : "button-selector-item"}
                data-attr-name="turn-taking"
                to={linkToPaths[2]}
                onClick={this.handleClick.bind(this, "turn-taking")}>
                <Icon path={mdiChartGantt} className="button-selector-item-icon" size={1} />
                <span className="button-selector-item-text">
                  Turn Taking
                </span>
              </Link>

              <Link
                className={this.props.buttonSelectorSelectedOption === "transcript" ? "button-selector-item active" : "button-selector-item"}
                data-attr-name="transcript"
                to={linkToPaths[3]}
                onClick={this.handleClick.bind(this, "transcript")}>
                <Icon path={mdiCommentTextMultipleOutline} className="button-selector-item-icon" size={1} />
                <span className="button-selector-item-text">
                  Transcript
                </span>
              </Link>*/}
            </div>

            {this.props.admin ?
              <div className="button-selector-admin-options">
                <Link
                  className="button-selector-item active"
                  data-attr-name="admin-user"
                  to={`/admin/user/${this.props.admin.userId}`}>
                  <Icon path={mdiAccount} className="button-selector-item-icon" size={1} />
                  <span className="button-selector-item-text">
                    Back to User Page
                  </span>
                </Link>
              </div>
            : ""}

          </div>
        );
    }
}

ButtonSelector.propTypes = {
    buttonSelectorSelectedOption: PropTypes.string.isRequired
}

export default withRouter(ButtonSelector);
