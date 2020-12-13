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

import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

import { listDatasets } from "./actions/datasetActions";
import Parser from './data/parser';
import data_tom from './data/data_tom';
import data_kim from './data/data_kim';
import data_bill from './data/data_bill';

class App extends Component {
    constructor(props) {
        super(props);
        // console.log("init props", props);

        var dataRows = [data_tom[0], data_kim[0], data_bill[0]];//, data_tom[0], data_kim[0], data_bill[0]];
        var dataParsers = dataRows.map((row) => {
            var parser = new Parser(row);
            return parser;
        });

        this.state = {
            dataRows: dataRows,
            dataParsers: dataParsers,
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            activeDataRowIndex: 0
        };
    }

    componentDidMount() {
        // console.log("app mount");
        // console.log("props", this.props);
        // console.log("state", this.state);
        this.props.listDatasets(this.props.auth.user.id);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.datasets.dataParsers) {
            // var dataParsers = nextProps.datasets.dataParsers;

            // console.log("here", nextProps.datasets.dataParsers);
            // if ()
    //         this.setState({
    //             dataParsers: nextProps.datasets.dataParsers
    //         });
    //     }
    //
    //     return true;
    // }

    //         var dataRows = nextProps.datasets.datasets.map((dataset) => {
    //             return {
    //                 ...dataset,
    //                 data: JSON.parse(dataset.jsonData)
    //             }
    //         });
            // var dataParsers = dataRows.map((row) => {
            //     console.log("row", row);
            //     var parser = new Parser(row);
            //     return parser;
            // });

            // debugger;

            // this.dismountForm();
        // }

    //     return true;
    // }

    activeParser = function() {
        return this.state.dataParsers[this.state.activeDataRowIndex];
    }

    // If logged in and user navigates to Register page, should redirect them to dashboard
    // componentDidMount() {
    //     var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
    //     var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");
    //
    //     this.setState({
    //         buttonSelectorSelectedOption: buttonSelectorSelectedOption,
    //         transcriptLocationHash: transcriptLocationHash
    //     });
    //
    //     this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
    //
    //     this.unlisten = this.props.history.listen((location, action) => {
    //         var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
    //         var transcriptLocationHash = window.location.hash || "";
    //
    //         localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
    //         localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
    //     }).bind(this);
    // }

    // componentWillUnmount() {
    //     this.unlisten();
    // }

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
            dataParsers={this.props.datasets.dataParsers}
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

export default connect(
  mapStateToProps,
  { listDatasets }
)(withRouter(App));
