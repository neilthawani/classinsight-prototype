import React, { Component } from "react";

import { Route } from "react-router-dom"; // Switch
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "./layout/Navbar";

import Landing from "./layout/Landing";
import Register from "./auth/Register";
import Login from "./auth/Login";
import PrivateRoute from "./private-route/PrivateRoute";
// import DashboardMenus from './DashboardMenus';

import Dashboard from './dashboard/Dashboard';
import Visualization from './visualization/Visualization';

import AdminPanel from './admin/AdminPanel';

import { listDatasets } from "../actions/datasetActions";
import dashboardRoutes from '../fixtures/dashboardRoutes';

class App extends Component {
    // set button selector to match URL on refresh
    componentDidMount() {
        // debugger;
        if (!this.props.location.pathname.includes("preview"))  {
            // console.log(this.props.datasets.dataParsers, "this.props.location.pathname", this.props.location.pathname);
            // console.log("this.props.match", this.props.match);
            this.props.listDatasets(this.props.auth.user.id).then((response) => {
                this.setState({
                    areDatasetsLoaded: true
                });
            });
        }

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
              path='/visualization'
              component={(props) => (
                <Visualization {...props} />
              )}
            />
            <PrivateRoute
              path='/dashboard'
              component={(props) => (
                <Dashboard {...props} />
              )}
            />
          </div>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired
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
