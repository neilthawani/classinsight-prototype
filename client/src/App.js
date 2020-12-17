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
import UserDetailsPage from './components/admin/UserDetailsPage';

import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

import Parser from './data/parser';
import data_tom from './data/data_tom';
import data_kim from './data/data_kim';
import data_bill from './data/data_bill';

class App extends Component {
    constructor(props) {
        super(props);

        var dataRows = [data_tom[0], data_kim[0], data_bill[0]];
        var dataParsers = dataRows.map((row) => {
            var parser = new Parser(row);
            return parser;
        });

        this.state = {
            dataParsers: dataParsers,
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            activeDataRowIndex: parseInt(localStorage.getItem("activeDataRowIndex"), 10) || 0
        };
    }

    activeParser = function() {
        return this.state.dataParsers[this.state.activeDataRowIndex];
    }

    // set button selector to match URL on refresh
    componentDidMount() {
        // var activeDataRowIndex = parseInt(localStorage.getItem("activeDataRowIndex"), 10);
        var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");

        // this.setState({
        //     buttonSelectorSelectedOption: buttonSelectorSelectedOption,
        //     transcriptLocationHash: transcriptLocationHash
        // });

        this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);

        this.unlisten = this.props.history.listen((location, action) => {
            // console.log("location.pathname", location.pathname);
            var buttonSelectorSelectedOption = location.pathname.slice(1);//location.pathname.lastIndexOf("/") + 1);
            var transcriptLocationHash = window.location.hash || "";

            this.setState({
                // activeDataRowIndex: activeDataRowIndex,
                buttonSelectorSelectedOption: buttonSelectorSelectedOption,
                transcriptLocationHash: transcriptLocationHash
            });

            // localStorage.setItem("activeDataRowIndex", activeDataRowIndex);
            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
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
        localStorage.setItem("activeDataRowIndex", index);

        this.setState({
            activeDataRowIndex: index
        });

        if (this.props.location.hash !== "") {
            this.props.history.push(this.props.location.pathname);
        }
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
              path='/admin/user/:id'
              component={(props) => (
                <UserDetailsPage {...props} />
              )}
            />

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

export default withRouter(App);
