import React, { Component } from "react";

import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "./layout/Navbar";

import Landing from "./layout/Landing";
import Register from "./auth/Register";
import Login from "./auth/Login";
import PrivateRoute from "./private-route/PrivateRoute";
import DashboardMenus from './DashboardMenus';

import Dashboard from './dashboard/Dashboard';

import AdminPanel from './admin/AdminPanel';
import UserDetailsPage from './admin/UserDetailsPage';
import DatasetPreview from './admin/DatasetPreview';

import { listDatasets } from "../actions/datasetActions";
import dashboardRoutes from '../fixtures/dashboardRoutes';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areDatasetsLoaded: false,
            sidebarSelectedOption: localStorage.getItem("sidebarSelectedOption"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    // set button selector to match URL on refresh
    componentDidMount() {
        // debugger;
        // if (!this.props.location.pathname.includes("preview"))  {
            // console.log(this.props.datasets.dataParsers, "this.props.location.pathname", this.props.location.pathname);
            // console.log("this.props.match", this.props.match);
            this.props.listDatasets(this.props.auth.user.id).then((response) => {
                this.setState({
                    areDatasetsLoaded: true
                });
            });
        // }

        var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");

        if (dashboardRoutes.paths.includes(this.props.location.pathname)) {
            this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
        }

        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname;
            var transcriptLocationHash = window.location.hash || "";

            if (dashboardRoutes.paths.includes(buttonSelectorSelectedOption)) {
                this.setState({
                    buttonSelectorSelectedOption: buttonSelectorSelectedOption.slice(1),
                    transcriptLocationHash: transcriptLocationHash
                });

                localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption.slice(1));
                localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
            }
        }).bind(this);
    }

    componentWillUnmount() {
        this.unlisten();
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
        if (!this.state.areDatasetsLoaded) {
            return null;
        }

        return (
          <div className="app">
            <Navbar
              datasets={this.props.datasets}/>

            {dashboardRoutes.paths.includes(window.location.pathname) ?
              <DashboardMenus
                sidebarSelectedOption={this.state.sidebarSelectedOption}
                handleSidebarRowClick={this.handleSidebarRowClick.bind(this)}
                buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
                handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
                datasets={this.props.datasets} /> : null}

            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            <PrivateRoute
              exact
              path="/admin"
              component={(props) => (
                <AdminPanel {...props} />
              )}
            />

            <PrivateRoute
              exact
              path='/admin/user/:userId'
              component={(props) => (
                <UserDetailsPage {...props} />
              )}
            />

            <PrivateRoute
              path='/admin/user/:userId/preview'
              component={(props) => (
                <DatasetPreview {...props} />
              )}
            />

            <div className="dashboard-content">
              <PrivateRoute
                path='/dashboard'
                component={(props) => (
                  <Dashboard {...props} />
                )}
              />
              
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

App.propTypes = {
    auth: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired
}

// NOTE: Do not bind admin.datasets to this method.
// It will cause componentDidMount to fire infinitely in all subcomponents which use it.
function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets }
)(App));
