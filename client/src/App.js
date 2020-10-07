import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
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

// Check for token to keep user logged in
if (localStorage.jwtToken) {
    const decoded = handleLogin(localStorage.jwtToken);

    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());

        // Redirect to login
        window.location.href = "./login";
    }
}

function handleLogin(token) {
    // console.log("handleLogin token", token, [token]);
    // Set auth token header auth
    setAuthToken(token);

    // Decode token and get user info and exp
    const decoded = jwt_decode(token);

    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    return decoded;
}

class App extends Component {
    handleGoogleLogin(res) {
        // console.log("token", res.tokenId);
        const decoded = handleLogin(res.tokenId);
        console.log("decoded", decoded);
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
              {/*<Route exact path="/login" component={Login} />*/}
              {/* https://github.com/ReactTraining/react-router/issues/4105 */}
              <Route
                path='/login'
                render={routeProps => <Login {...routeProps} handleGoogleLogin={this.handleGoogleLogin.bind(this)}/>} />

              <PrivateRoute path="/dashboard" component={Dashboard} />
            </div>
          </Router>
        </Provider>
      );
    }
}

export default App;
