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

        this.state = {
            selectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            activeDataRow: data_tom[0]
        };
    }

    dataRows = [data_tom[0], data_kim[0]];

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);
        this.setState({
            selectedOption: value
        });
    }

    handleDataRowClick(row) {
        // console.log("row", row);
        this.setState({
            activeDataRow: row
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
                  dataRows={this.dataRows}
                  activeDataRowId={this.state.activeDataRow.id}
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
                        <Dashboard {...props} data={this.state.activeDataRow} />
                      )}
                    />

                    <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} />
                    <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} />
                    <PrivateRoute exact path="/dashboard/transcript" component={Transcript} />
                  </Switch>
                </div>
              </div>
            </Router>
          </Provider>
        );
    }
}

export default App;
