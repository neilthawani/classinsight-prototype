import React, { Component } from "react";

import { Route } from "react-router-dom"; // Switch
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "./layout/Navbar";

import Landing from "./Landing";
import Register from "./auth/Register";
import Login from "./auth/Login";
import PrivateRoute from "./private-route/PrivateRoute";
// import DashboardMenus from './DashboardMenus';

// import Dashboard from './dashboard/Dashboard';
import Visualization from './visualization/Visualization';

import AdminPanel from './admin/AdminPanel';
import UserDetailsPage from './admin/UserDetailsPage';
// import DatasetPreview from './admin/DatasetPreview';


// import { listDatasets } from "../actions/datasetActions";
// import dashboardRoutes from '../fixtures/dashboardRoutes';

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

            {/*<PrivateRoute
              path='/admin/user/:userId/preview'
              component={(props) => (
                <DatasetPreview {...props} />
              )}
            />*/}

            <PrivateRoute
              path='/visualization'
              component={(props) => (
                <Visualization {...props} />
              )}
            />

            <PrivateRoute
              exact
              path='/visualization/:userId/preview'
              component={(props) => (
                <Visualization {...props} />
              )}
            />
          </div>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object.isRequired,
    // listDatasets: PropTypes.func.isRequired
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
  { }//listDatasets
)(App));
