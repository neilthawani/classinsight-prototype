import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import TalkRatio from './components/visualizations/TalkRatio';
import Transcript from './components/visualizations/Transcript';
import TurnTaking from './components/visualizations/TurnTaking';

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
  render() {
    return (
      <Provider store={store}>
        {/* Routers can only have one child element */}
        <Router>
          <div className="app-container">
            <Navbar />

            <div className="button-selector">
              <Link className="button-selector-item" to="/dashboard/transcript">Transcript</Link>
              <Link className="button-selector-item" to="/dashboard/talk-ratio">Talk Ratio</Link>
              {/*onClick={this.handleClick.bind(this, "talk-ratio")}*/}
              <Link className="button-selector-item" to="/dashboard/turn-taking">Turn Taking</Link>
            </div>

            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <div class="text-center">
              {/* A <Switch> looks through all its children <Route> elements and renders the first one whose path matches the current URL. Use a <Switch> any time you have multiple routes, but you want only one of them to render at a time. */}
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} />
                <PrivateRoute exact path="/dashboard/transcript" component={Transcript} />
                <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
