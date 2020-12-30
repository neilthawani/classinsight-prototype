import React, { Component } from "react";

<<<<<<< HEAD
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
// import { Route, Switch, withRouter } from "react-router-dom";
// import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
=======
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
>>>>>>> origin/main

import Navbar from "./components/layout/Navbar";

import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";

import ButtonSelector from './components/ButtonSelector';

import Dashboard from "./components/dashboard/Dashboard";
import DashboardMenus from './DashboardMenus';

<<<<<<< HEAD
=======
import AdminPanel from './components/admin/AdminPanel';
import UserDetailsPage from './components/admin/UserDetailsPage';

>>>>>>> origin/main
import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

<<<<<<< HEAD

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}
=======
import Parser from './data/parser';
import data_tom from './data/data_tom';
import data_kim from './data/data_kim';
import data_bill from './data/data_bill';
>>>>>>> origin/main

class App extends Component {
    constructor(props) {
        super(props);

<<<<<<< HEAD
        this.state = {
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            transcriptLocationHash: localStorage.getItem("transcriptLocationHash") || ""
        };
    }
    componentWillMount() {
        // console.log("componentWillMount");
        // update ButtonSelector selected option on drilldown
        // this.unlisten = this.props.history.listen((location, action) => {
        var location = window.location;
            var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
            // var transcriptLocationHash = location.hash || "";

            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            // localStorage.setItem("transcriptLocationHash", transcriptLocationHash);

            this.setState({
                buttonSelectorSelectedOption: buttonSelectorSelectedOption,
                // transcriptLocationHash: transcriptLocationHash
            });
        // });
    }

    componentWillUnmount() {
        // console.log("componentWillUnmount");
        // this.unlisten();
    }

    // componentDidMount() {
    //     console.log("componentDidMount");
    //     // If logged in and user navigates to Register page, should redirect them to dashboard
    //     var buttonSelectorSelectedOption = this.state.buttonSelectorSelectedOption || localStorage.getItem("buttonSelectorSelectedOption"),
    //         transcriptLocationHash = this.state.transcriptLocationHash || localStorage.getItem("transcriptLocationHash");
    //     console.log("buttonSelectorSelectedOption", buttonSelectorSelectedOption, "transcriptLocationHash", transcriptLocationHash);
    //     console.log("localStorage", localStorage);
    //     this.props.history.push(`/dashboard/${buttonSelectorSelectedOption}${transcriptLocationHash}`);
    // }

    handleClick(value) {
        console.log("value", value);
        localStorage.setItem("buttonSelectorSelectedOption", value);
        this.setState({
            buttonSelectorSelectedOption: value
        });

        console.log("this.state", this.state);
    }
    render() {
        return (
          <Provider store={store}>
            {/* Routers can only have one child element */}
            <Router>
              <div className="app-container">
                <Navbar />

                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />

                {/* coarse, medium, and fine-grained visualizations */}
                <ButtonSelector
                  selectedOption={this.state.buttonSelectorSelectedOption}
                  handleClick={this.handleClick.bind(this)} />

                <Switch>
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} />
                  <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} />
                  <PrivateRoute exact path="/dashboard/transcript" component={Transcript} />
                </Switch>
              </div>
            </Router>
          </Provider>
=======
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
        var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");

        if (this.dashboardRoutePaths().includes(this.props.location.pathname)) {
            console.log("push");
            this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
        }

        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname;
            var transcriptLocationHash = window.location.hash || "";

            if (this.dashboardRoutePaths().includes(buttonSelectorSelectedOption)) {
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
>>>>>>> origin/main
        );
    }
}

export default withRouter(App);
<<<<<<< HEAD
// export default App;
=======
>>>>>>> origin/main
