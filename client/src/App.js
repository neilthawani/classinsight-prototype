// normal login:
// email: "nthawani@andrew.cmu.edu"
// exp: 1641682510
// iat: 1610125584
// id: "6"
// name: "Neil Thawani"
// userType: 100
//
// google login:
// at_hash: "GYp41fxbnW75H6KFxPnxPw"
// aud: "302262104197-a1u8tg76brir9v2pq8t17ej7spff4ueg.apps.googleusercontent.com"
// azp: "302262104197-a1u8tg76brir9v2pq8t17ej7spff4ueg.apps.googleusercontent.com"
// email: "nthawani@andrew.cmu.edu"
// email_verified: true
// exp: 1610129756
// family_name: "Thawani"
// given_name: "Neil"
// hd: "andrew.cmu.edu"
// iat: 1610126156
// iss: "accounts.google.com"
// jti: "edb50891a2974a85da0a7c4c30ed3faef9feb514"
// locale: "en"
// name: "Neil Thawani"
// picture: "https://lh3.googleusercontent.com/a-/AOh14Gjvr0h4R8DNTwzRPJPa5Yk8F8x65MoCGww0VfRA=s96-c"
// sub: "109419769420432800105"

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
import DashboardMenus from './DashboardMenus';

import AdminPanel from './components/admin/AdminPanel';
import UserDetailsPage from './components/admin/UserDetailsPage';
import DatasetPreview from './components/admin/DatasetPreview';

import { listDatasets } from "./actions/datasetActions";
import dashboardRoutes from './fixtures/dashboardRoutes';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";

import { setCurrentUser, logoutUser } from "./actions/authActions";


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
    console.log("decoded", decoded);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    return decoded;
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areDatasetsLoaded: false,
            sidebarSelectedOption: localStorage.getItem("sidebarSelectedOption"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    // set button selector to match URL on refresh
    componentDidMount() {
        console.log("this.props.auth.user", this.props.auth.user);
        this.props.listDatasets(this.props.auth.user.id).then((response) => {
            this.setState({
                areDatasetsLoaded: true
            });
        });

        var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");

        if (dashboardRoutes.paths.includes(this.props.location.pathname)) {
            this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
        }

        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname;
            var transcriptLocationHash = window.location.hash || "";

            if (dashboardRoutes.paths.includes(buttonSelectorSelectedOption)) {
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

    handleSidebarRowClick(value) {
        localStorage.setItem("sidebarSelectedOption", value);

        this.setState({
            sidebarSelectedOption: value
        });
    }

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);

        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    dashboardRoutes(admin) {
        return dashboardRoutes.definitions();
    }

    // handleGoogleLogin(res) {
    //   // console.log("token", res.tokenId);
    //   const decoded = handleLogin(res.tokenId);
    //
    //   store.dispatch(setCurrentUser(decoded));
    //   // console.log("decoded", decoded);
    // }

    render() {
        if (!this.state.areDatasetsLoaded) {
            return null;
        }

        return (
          <div className="app">
            <Navbar
              datasets={this.props.datasets}/>

            {dashboardRoutes.paths.includes(window.location.pathname) ?
              <DashboardMenus
                sidebarSelectedOption={this.state.sidebarSelectedOption}
                handleSidebarRowClick={this.handleSidebarRowClick.bind(this)}
                buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
                handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
                datasets={this.props.datasets} /> : null}

            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            {/*<Route exact path="/login" component={Login} />*/}
            {/* https://github.com/ReactTraining/react-router/issues/4105 */}
              <Route
                path='/login'
                render={routeProps => <Login {...routeProps} />} />

            <PrivateRoute
              exact
              path="/admin"
              component={(props) => (
                <AdminPanel {...props} />
              )}
            />

            <PrivateRoute
              exact
              path='/admin/user/:userId'
              component={(props) => (
                <UserDetailsPage {...props} />
              )}
            />

            <PrivateRoute
              path='/admin/user/:userId/preview'
              component={(props) => (
                <DatasetPreview {...props} />
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
}

// NOTE: Do not bind admin.datasets to this method.
// It will cause componentDidMount to fire infinitely in all subcomponents which use it.
function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets }
)(App));
