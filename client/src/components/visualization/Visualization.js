import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardMenus from '../layout/DashboardMenus';
import { listDatasets, showDataset } from "../../actions/datasetActions";
import PrivateRoute from "../private-route/PrivateRoute";
import { Switch } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import TalkRatio from './talk-ratio/TalkRatio';
import Transcript from './transcript/Transcript';
import TurnTaking from './turn-taking/TurnTaking';

import dashboardRoutes from '../../fixtures/dashboardRoutes';

class Visualization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areDatasetsLoaded: false,
            sidebarSelectedCourse: localStorage.getItem("activeDataRowIndex"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    handleSidebarRowCourseClick(value) {
        this.props.showDataset(value);
        console.log("handleSidebarRowCourseClick", value);
        // handleSidebarRowClick
        localStorage.setItem("activeDataRowIndex", value);

        this.setState({
            sidebarSelectedCourse: value
        });

        // if (this.state.buttonSelectorSelectedOption === "dashboard") {
        //     console.log("this.props.history", this.props.history);
        //     this.props.history.push(`/visualization/talk-ratio`);
        // }
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

        // debugger;
        // if (!this.props.location.pathname.includes("preview"))  {
        //     console.log(this.props.datasets.dataParsers, "this.props.location.pathname", this.props.location.pathname);
        //     // console.log("this.props.match", this.props.match);
        //     this.props.listDatasets(this.props.auth.user.id).then((response) => {
        //         this.setState({
        //             areDatasetsLoaded: true
        //         });
        //     });
        // }

    // set button selector to match URL on refresh
    // componentDidMount() {
    //     var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
    //     var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");
    //
    //     if (dashboardRoutes.paths.includes(this.props.location.pathname)) {
    //         this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
    //     }
    //
    //     this.unlisten = this.props.history.listen((location, action) => {
    //         var buttonSelectorSelectedOption = location.pathname;
    //         var transcriptLocationHash = window.location.hash || "";
    //
    //         if (dashboardRoutes.paths.includes(buttonSelectorSelectedOption)) {
    //             this.setState({
    //                 buttonSelectorSelectedOption: buttonSelectorSelectedOption.slice(1),
    //                 transcriptLocationHash: transcriptLocationHash
    //             });
    //
    //             localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption.slice(1));
    //             localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
    //         }
    //     }).bind(this);
    // }
    //
    // componentWillUnmount() {
    //     this.unlisten();
    // }

    render() {
        return (
          <div>
            <DashboardMenus
              sidebarSelectedCourse={this.state.sidebarSelectedCourse}
              handleSidebarRowCourseClick={this.handleSidebarRowCourseClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
              datasets={this.props.datasets} />

            <div className="dashboard-content">
              <PrivateRoute
                path='/visualization/dashboard'
                component={(props) => (
                  <Dashboard {...props} />
                )}
              />
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

Visualization.propTypes = {
    auth: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired,
    showDataset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets, showDataset }
)(Visualization));
