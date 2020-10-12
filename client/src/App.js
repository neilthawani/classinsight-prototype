import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import ButtonSelector from './components/ButtonSelector';
import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

import Parser from './data/parser';
import data_tom from './data/data_tom';
import data_kim from './data/data_kim';


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

class App extends Component {
    constructor(props) {
        super(props);

        var dataRows = [data_tom[0], data_kim[0]];
        var dataParsers = dataRows.map((row) => {
            var parser = new Parser(row);
            return parser;
        });
        console.log("dataParsers", dataParsers);

        this.state = {
            dataParsers: dataParsers,
            // dataRows: dataRows,
            selectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            activeDataRowIndex: 0
        };
    }

    activeParser = function() {
        return this.state.dataParsers[this.state.activeDataRowIndex];
    }

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);
        this.setState({
            selectedOption: value
        });
    }

    handleDataRowClick(index) {
        // console.log("row", row);
        this.setState({
            activeDataRowIndex: index
        });
    }

    render() {
        return (
          <Provider store={store}>
            {/* Routers can only have one child element */}
            <Router>
              <div className="app-container">
                <Navbar />

                {/* coarse, medium, and fine-grained visualizations */}
                <ButtonSelector
                  selectedOption={this.state.selectedOption}
                  handleClick={this.handleButtonSelectorClick.bind(this)} />

                <Sidebar
                  dataRows={
                    this.state.dataParsers.map((parser) => {
                        return parser.data;
                    })
                  }
                  activeDataRowIndex={this.state.activeDataRowIndex}
                  handleDataRowClick={this.handleDataRowClick.bind(this)}/>

                <div className="app-container-content">
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />

                  {/* A <Switch> looks through all its children <Route> elements and
                    renders the first one whose path matches the current URL.
                    Use a <Switch> any time you have multiple routes,
                    but you want only one of them to render at a time. */}
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/dashboard"
                      component={(props) => (
                        <Dashboard {...props}
                        dataParsers={this.state.dataParsers}
                        data={this.activeParser().data} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/dashboard/talk-ratio"
                      component={(props) => (
                        <TalkRatio {...props}
                        dataParsers={this.state.dataParsers}
                        data={this.state.dataParsers[this.state.activeDataRowIndex].data} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/dashboard/turn-taking"
                      component={(props) => (
                        <TurnTaking {...props}
                        dataParsers={this.state.dataParsers}
                        data={this.state.dataParsers[this.state.activeDataRowIndex].data} />
                      )}
                    />
                    <PrivateRoute
                      exact
                      path="/dashboard/transcript"
                      component={(props) => (
                        <Transcript {...props}
                        dataParsers={this.state.dataParsers}
                        data={this.state.dataParsers[this.state.activeDataRowIndex].data} />
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </Router>
          </Provider>
        );
    }
}

export default App;
