import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardMenus from '../layout/DashboardMenus';
import { listDatasets, showDataset } from "../../actions/datasetActions";
import PrivateRoute from "../private-route/PrivateRoute";
// import { Switch } from "react-router-dom";
// import BaseViz from './BaseViz';

// import Dashboard from "../dashboard/Dashboard";
// import TalkRatio from './talk-ratio/TalkRatio';
// import Transcript from './transcript/Transcript';
// import TurnTaking from './turn-taking/TurnTaking';

import dashboardRoutes from '../../fixtures/dashboardRoutes';

// under componentDidMount:
// listDatasets
// this.props.auth.user.id
// props.match.params.userId

class UserViz extends Component {
    constructor(props) {
        // console.log("UserViz constructor", props);
        // debugger;
        super(props);


        // var isAdmin = false;//props.match.params.hasOwnProperty("userId");
        // console.log("isAdmin", isAdmin);

        this.state = {
            sidebarSelectedCourse: localStorage.getItem("activeDataRowIndex"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            areDatasetsLoaded: false,
            // isAdmin: isAdmin
        };
    }

    handleSidebarRowCourseClick(value) {
        this.props.showDataset(value);
        // console.log("handleSidebarRowCourseClick", value);
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

    // set button selector to match URL on refresh
    componentDidMount() {
        // console.log("this.props", this.props);

        this.props.listDatasets(this.props.auth.user.id).then((response) => {
            this.setState({
                areDatasetsLoaded: true
            });
        });

        // var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        // var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");
        //
        // if (dashboardRoutes.paths.includes(this.props.location.pathname)) {
        //     this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
        // }
        //
        // this.unlisten = this.props.history.listen((location, action) => {
        //     var buttonSelectorSelectedOption = location.pathname;
        //     var transcriptLocationHash = window.location.hash || "";
        //
        //     if (dashboardRoutes.paths.includes(buttonSelectorSelectedOption)) {
        //         this.setState({
        //             buttonSelectorSelectedOption: buttonSelectorSelectedOption.slice(1),
        //             transcriptLocationHash: transcriptLocationHash
        //         });
        //
        //         localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption.slice(1));
        //         localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
        //     }
        // }).bind(this);
    }

    componentWillUnmount() {
        // this.unlisten();
    }

    render() {
        // console.log("Visualization");
        // var areDatasetsLoaded = Object.keys(this.props.datasets).length > 0;
        //
        // if (!areDatasetsLoaded) {
        //     return null;
        // }

        // TODO: How is this calculated?
        // datasets={this.props.datasets}
        return (
          <div>
            <DashboardMenus
              sidebarSelectedCourse={this.state.sidebarSelectedCourse}
              handleSidebarRowCourseClick={this.handleSidebarRowCourseClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)} />

            <div className="dashboard-content">
              {/*<PrivateRoute
                path='/visualization/dashboard'
                component={(props) => (
                  <Dashboard {...props} />
                )}
              />*/}
              {/* A <Switch> looks through all its children <Route> elements and
                renders the first one whose path matches the current URL.
                Use a <Switch> any time you have multiple routes,
                but you want only one of them to render at a time. */}
              {/*<Switch>*/}


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

                {/*{this.dashboardRoutes(this.state.admin).map((routeObj, index) => {
                    return (
                        <PrivateRoute
                          exact
                          key={index}
                          path={routeObj.path}
                          component={routeObj.component}
                        />
                    )
                })}*/}


                {/*<PrivateRoute
                  exact
                  path='/visualization/admin/user/:userId/preview/dashboard'
                  component={(props) => ( <Dashboard {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/visualization/admin/user/:userId/preview/talk-ratio'
                  component={(props) => ( <TalkRatio {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/visualization/admin/user/:userId/preview/turn-taking'
                  component={(props) => ( <TurnTaking {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/visualization/admin/user/:userId/preview/transcript'
                  component={(props) => ( <Transcript {...props} /> )}
                />*/}
              {/*</Switch>*/}
            </div>
          </div>
        );
    }
}

UserViz.propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired,
    showDataset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        admin: state.admin,
        auth: state.auth,
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets, showDataset }
)(UserViz));
