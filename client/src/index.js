import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import { Provider } from "react-redux";
import store from "./store";

import { BrowserRouter as Router } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";

import App from './App';
import * as serviceWorker from './serviceWorker';

// // Check for token to keep user logged in
// if (localStorage.jwtToken) {
//     // Set auth token header auth
//     const token = localStorage.jwtToken;
//     setAuthToken(token);
//     // Decode token and get user info and exp
//     const decoded = jwt_decode(token);
//     // Set user and isAuthenticated
//     store.dispatch(setCurrentUser(decoded));
//     // Check for expired token
//     const currentTime = Date.now() / 1000; // to get in milliseconds
//     if (decoded.exp < currentTime) {
//         // Logout user
//         store.dispatch(logoutUser());
//
//         // Redirect to login
//         window.location.href = "./login";
//     }
// }

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

ReactDOM.render(
  <Provider store={store}>
    {/* Routers can only have one child element */}
    <Router>
      <App />
    </Router>
  </Provider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
