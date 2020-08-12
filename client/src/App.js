import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
// import ButtonSelector from './components/ButtonSelector';
// import VisualizationComponents from './fixtures/visualization_components';

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

export default class App extends Component {
  // constructor(props) {
  //     super(props);

  //     if (!window.localStorage.getItem("buttonSelectorSelectedOption")) {
  //         window.localStorage.setItem("buttonSelectorSelectedOption", Object.keys(this.components)[0]);
  //     }

  //     this.state = {
  //         selectedOption: window.localStorage.getItem("buttonSelectorSelectedOption")
  //     };
  // }

  // components = VisualizationComponents;
  // buttonSelectorOptions = Object.keys(this.components);

  // handleClick(value) {
  //     this.setState({
  //         selectedOption: value
  //     });

  //     window.localStorage.setItem("buttonSelectorSelectedOption", value);
  // }

  render() {
    return (
      <div className="container">
        <Provider store={store}>
          <Router>
            <Navbar />

            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </Router>
        </Provider>

        {/* <ButtonSelector
              options={this.buttonSelectorOptions}
              selectedOption={this.state.selectedOption}
              onClick={this.handleClick.bind(this)} />

            <div className="visualization">
              {React.createElement(this.components[this.state.selectedOption])}
            </div> */}
      </div>
    )
  }
}
