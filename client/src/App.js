import React, { Component } from "react";

import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardMenus from './DashboardMenus';

import AdminPanel from './components/admin/AdminPanel';
import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

import Parser from './data/parser';
import data_tom from './data/data_tom';
import data_kim from './data/data_kim';

class App extends Component {
    constructor(props) {
        super(props);

        var dataRows = [data_tom[0], data_kim[0]];
        var dataParsers = dataRows.map((row) => {
            var parser = new Parser(row);
            return parser;
        });

        this.state = {
            dataParsers: dataParsers,
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            activeDataRowIndex: 0
        };
    }

    activeParser = function() {
        return this.state.dataParsers[this.state.activeDataRowIndex];
    }

    // If logged in and user navigates to Register page, should redirect them to dashboard
    componentDidMount() {
        var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");

        this.setState({
            buttonSelectorSelectedOption: buttonSelectorSelectedOption,
            transcriptLocationHash: transcriptLocationHash
        });

        this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
    }
    componentWillMount() {
        // update ButtonSelector selected option on drilldown
        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
            var transcriptLocationHash = window.location.hash || "";

            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            localStorage.setItem("transcriptLocationHash", transcriptLocationHash);

            this.setState({
                buttonSelectorSelectedOption: buttonSelectorSelectedOption,
                transcriptLocationHash: transcriptLocationHash
            });

        }).bind(this);
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
        this.setState({
            activeDataRowIndex: index
        });
    }

    dashboardRoutes() {
        return [{
            path: "/dashboard",
            component: (props) => ( <Dashboard {...props} activeParser={this.activeParser()} /> )
        }, {
            path: "/talk-ratio",
            component: (props) => ( <TalkRatio {...props} activeParser={this.activeParser()} /> )
        }, {
            path: "/turn-taking",
            component: (props) => ( <TurnTaking {...props} activeParser={this.activeParser()} /> )
        }, {
            path: "/transcript",
            component: (props) => ( <Transcript {...props} activeParser={this.activeParser()} /> )
        }]
    }

    dashboardRoutePaths() {
        return this.dashboardRoutes().map((routeObj) => {
            return routeObj.path;
        });
    }

    render() {
        return (
          <div className="app">
            <Navbar />

            {this.dashboardRoutePaths().includes(window.location.pathname) ?
              <DashboardMenus
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              dataParsers={this.state.dataParsers}
              activeDataRowIndex={this.state.activeDataRowIndex}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
              handleSidebarRowClick={this.handleSidebarRowClick.bind(this)} /> : ""}

            <div className="dashboard-content">
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {/* <PrivateRoute exact path="/admin" component={(props) => (
                  <AdminPanel {...props} />
              )} /> */}

              {/* A <Switch> looks through all its children <Route> elements and
                renders the first one whose path matches the current URL.
                Use a <Switch> any time you have multiple routes,
                but you want only one of them to render at a time. */}
              <Switch>
                <PrivateRoute
                  exact
                  path="/admin"
                  component={(props) => (
                    <AdminPanel {...props} />
                  )}
                />

                {this.dashboardRoutes().map((routeObj) => {
                    return (
                        <PrivateRoute
                          exact
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

export default withRouter(App);
