import React, { Component } from "react";

import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "./components/layout/Navbar";

import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardMenus from './DashboardMenus';

import AdminPanel from './components/admin/AdminPanel';
import UserDetailsPage from './components/admin/UserDetailsPage';

import { listDatasets } from "./actions/datasetActions";

import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

import dashboardRoutes from './fixtures/dashboardRoutes';

// import Parser from './data/parser';
// import data_tom from './data/data_tom';
// import data_kim from './data/data_kim';
// import data_bill from './data/data_bill';

class App extends Component {
    constructor(props) {
        super(props);

        // var dataRows = [data_tom[0], data_kim[0], data_bill[0]];
        // var dataParsers = dataRows.map((row) => {
        //     var parser = new Parser(row);
        //     return parser;
        // });

        this.state = {
            areDatasetsLoaded: false,
            // dataParsers: dataParsers,
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption") || "dashboard",
            // activeDataRowIndex: parseInt(localStorage.getItem("activeDataRowIndex"), 10) || 0
        };
    }

    activeParser = function() {
        return this.state.dataParsers[this.state.activeDataRowIndex];
    }

    // set button selector to match URL on refresh
    componentDidMount() {
        console.log("App:componentDidMount");
        this.props.listDatasets(this.props.auth.user.id).then(res => {
            this.setState({
                areDatasetsLoaded: true
            });
        });

        // var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        // var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");
        //
        // this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
        //
        // this.unlisten = this.props.history.listen((location, action) => {
        //     var buttonSelectorSelectedOption = location.pathname.slice(1);
        //     var transcriptLocationHash = window.location.hash || "";
        //
        //     this.setState({
        //         buttonSelectorSelectedOption: buttonSelectorSelectedOption,
        //         transcriptLocationHash: transcriptLocationHash
        //     });
        //
        //     localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
        //     localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
        // }).bind(this);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);

        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    handleSidebarRowClick(index) {
        localStorage.setItem("activeDataRowIndex", index);

        this.setState({
            activeDataRowIndex: index
        });

        if (this.props.location.hash !== "") {
            this.props.history.push(this.props.location.pathname);
        }
    }

    dashboardRoutes = dashboardRoutes.definitions();

    dashboardRoutePaths = dashboardRoutes.paths;
    // () {
    //     return this.dashboardRoutes.map((routeObj) => {
    //         return routeObj.path;
    //     });
    // }

    render() {
        return (
          <div className="app">
            <Navbar />

            {this.dashboardRoutePaths.includes(window.location.pathname) ?
              <DashboardMenus
                buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
                dataParsers={this.state.dataParsers}
                activeDataRowIndex={this.state.activeDataRowIndex}
                handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
                handleSidebarRowClick={this.handleSidebarRowClick.bind(this)} /> : ""}

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

            {/*<PrivateRoute
              path='/admin/user/:userId/preview'
              component={(props) => (
                <DatasetPreview {...props} />
              )}
            />*/}

            {this.state.areDatasetsLoaded ?
              <div className="dashboard-content">
                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/dashboard'
                  component={(props) => ( <Dashboard {...props} /> )}
                />
                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/talk-ratio'
                  component={(props) => ( <TalkRatio {...props} /> )}
                />
                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/turn-taking'
                  component={(props) => ( <TurnTaking {...props} /> )}
                />
                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/transcript'
                  component={(props) => ( <Transcript {...props} /> )}
                />

                {/* A <Switch> looks through all its children <Route> elements and
                  renders the first one whose path matches the current URL.
                  Use a <Switch> any time you have multiple routes,
                  but you want only one of them to render at a time. */}
                <Switch>
                  {this.dashboardRoutes.map((routeObj, index) => {
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
              </div> : ""}
          </div>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    // admin: PropTypes.object.isRequired,
    // deleteDatasetById: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets }
)(App));
