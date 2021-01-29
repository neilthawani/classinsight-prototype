import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardMenus from '../DashboardMenus';
import { listDatasets } from "../../actions/datasetActions";
import PrivateRoute from "../private-route/PrivateRoute";
import { Switch } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import TalkRatio from './talk-ratio/TalkRatio';
import Transcript from './transcript/Transcript';
import TurnTaking from './turn-taking/TurnTaking';

import dashboardRoutes from '../../fixtures/dashboardRoutes';

class Visualization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areDatasetsLoaded: false,
            sidebarSelectedOption: localStorage.getItem("sidebarSelectedOption"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    handleSidebarRowClick(value) {
        localStorage.setItem("sidebarSelectedOption", value);

        this.setState({
            sidebarSelectedOption: value
        });
    }

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);

        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    dashboardRoutes(admin) {
        return dashboardRoutes.definitions();
    }

    render() {
        return (
          <div>
            <DashboardMenus
              sidebarSelectedOption={this.state.sidebarSelectedOption}
              handleSidebarRowClick={this.handleSidebarRowClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
              datasets={this.props.datasets} />

            <div className="dashboard-content">
              {/* A <Switch> looks through all its children <Route> elements and
                renders the first one whose path matches the current URL.
                Use a <Switch> any time you have multiple routes,
                but you want only one of them to render at a time. */}
              <Switch>
                {this.dashboardRoutes().map((routeObj, index) => {
                    return (
                        <PrivateRoute
                          exact
                          key={index}
                          path={routeObj.path}
                          component={routeObj.component}
                        />
                    )
                })}
              </Switch>
            </div>
          </div>
        );
    }
}

Visualization.propTypes = {
    auth: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets }
)(Visualization));
