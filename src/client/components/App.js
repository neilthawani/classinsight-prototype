import React, { Component } from "react";

import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "./layout/Navbar";

import Landing from "./Landing";
import Register from "./auth/Register";
import Login from "./auth/Login";
import PrivateRoute from "./private-route/PrivateRoute";

import AdminViz from './visualization/AdminViz';
import UserViz from './visualization/UserViz';

import AdminPanel from './admin/AdminPanel';
import UserDetailsPage from './admin/UserDetailsPage';

class App extends Component {
    render() {
        return (
          <div>
            <Navbar
              datasets={this.props.datasets}/>

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
              path='/admin/user/:userId'
              component={(props) => (
                <UserDetailsPage {...props} />
              )}
            />

            <PrivateRoute
              path='/admin/user/:userId/preview'
              component={(props) => (
                <AdminViz {...props} />
              )}
            />

            <PrivateRoute
              path='/visualization'
              component={(props) => (
                <UserViz {...props} />
              )}
            />
          </div>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object.isRequired
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
  {}
)(App));
