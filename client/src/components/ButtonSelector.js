import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import dashboardRoutes from '../fixtures/dashboardRoutes';

class ButtonSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: {}
        };

        var userId = props.match.params.userId;

        if (userId) {
            this.state = {
                admin: {
                    userId: userId
                }
            };
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        var buttonSelectorSelectedOption = nextProps.location.pathname.slice(nextProps.location.pathname.lastIndexOf("/") + 1);
        if (buttonSelectorSelectedOption !== nextProps.buttonSelectorSelectedOption) {
            this.handleClick(buttonSelectorSelectedOption);
        }

        return true;
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;//Object.keys(this.props.datasets.activeParser).length > 0;
        // console.log("ButtonSelector areDatasetsLoaded", areDatasetsLoaded);
        // console.log("this.props.datasets", this.props.datasets);

        if (!areDatasetsLoaded) {
            return null;
        }

        return (
          <div className="button-selector">
            <div className="button-selector-options">
              {dashboardRoutes.definitions(this.state.admin).map((definitionObj, index, array) => {
                  return (
                    <Link
                      key={index}
                      className={this.props.buttonSelectorSelectedOption === definitionObj.buttonValue ? "button-selector-item active" : "button-selector-item"}
                      data-attr-name={definitionObj.buttonValue}
                      to={definitionObj.path}
                      onClick={this.handleClick.bind(this, definitionObj.buttonValue)}>

                      {definitionObj.icon}

                      <span className="button-selector-item-text">
                        {definitionObj.label}
                      </span>
                    </Link>
                  );
              })}
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
    buttonSelectorSelectedOption: PropTypes.string.isRequired,
    datasets: PropTypes.object.isRequired
}
//
// export default withRouter(ButtonSelector);
//
// Sidebar.propTypes = {
//     auth: PropTypes.object.isRequired,
//     datasets: PropTypes.object.isRequired,
//     showDataset: PropTypes.func.isRequired,
//     listDatasets: PropTypes.func.isRequired
// }

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
        // auth: state.auth
    }
};

export default withRouter(connect(
  mapStateToProps,
  { }
)(ButtonSelector));
