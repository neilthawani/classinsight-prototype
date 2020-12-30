import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DashboardMenus from '../../DashboardMenus';
import { listDatasets } from "../../actions/datasetActions";
import PrivateRoute from "../private-route/PrivateRoute";
import { Switch } from "react-router-dom";
// import { Switch } from "react-router-dom";// import App from '../../App';
// import PrivateRoute from "../private-route/PrivateRoute";
// import dashboardRoutes from '../../fixtures/dashboardRoutes';

import Dashboard from "../dashboard/Dashboard";
import TalkRatio from '../visualizations/talk-ratio/TalkRatio';
import Transcript from '../visualizations/transcript/Transcript';
import TurnTaking from '../visualizations/turn-taking/TurnTaking';
// import { showUserDetails } from "../../actions/adminActions";
// import { listDatasets, deleteDatasetById } from "../../actions/datasetActions";
// import UserTypes from '../../fixtures/user_types';
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import UploadDataForm from './UploadDataForm';
// import UserDatasetTableRow from './UserDatasetTableRow';
// import ResetPasswordForm from './ResetPasswordForm';

class DatasetPreview extends Component {
    constructor(props) {
        // console.log("DatasetPreview constructor");
        super(props);
        // console.log("props.location", props.location);
        // console.log("props", props);
        var userId = props.match.params.userId;
        // console.log("userId", userId);

        this.state = {
            sidebarSelectedOption: 0,//localStorage.getItem("sidebarSelectedOption") || 0,
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption") || "dashboard",
            userId: userId,
            areUserDatasetsLoaded: false,
            datasets: props.datasets

            // dataset: props.location.state.dataset
        };

        // console.log("props.location", props.location);
        // localStorage.setItem("activeDataRowIndex", 0);
    }


    componentDidMount() {
        // console.log("DatasetPreview componentDidMount");
        // console.log("DatasetPreview props", this.props);
        // localStorage.setItem("datasets", JSON.stringify(this.props.datasets));
        // if (!this.state.areUserDatasetsLoaded) {
        //     // console.log("are not loaded", this.state.userId);
        this.props.listDatasets(this.state.userId);
        // .then(res => {
        //     this.setState({
        //         areUserDatasetsLoaded: true
        //     });
        // });
        //         console.log("res", res);


                // this.props.history.push(`${this.state.buttonSelectorSelectedOption}`);
            // })
            // .catch(error => {
            //     console.error(error);
            // });
        // }
    }

    handleSidebarRowClick(value) {
        localStorage.setItem("sidebarSelectedOption", value);

        this.setState({
            sidebarSelectedOption: value
        });
    }

    handleButtonSelectorClick(value) {
        // console.log("DatasetPreview handleButtonSelectorClick", value, "props.datasets.activeDataRowIndex", this.props.datasets.activeDataRowIndex);
        localStorage.setItem("buttonSelectorSelectedOption", value);

        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    // handleSidebarRowClick(index) {
    //     this.setState({
    //         activeDataRowIndex: index
    //     });
        //
        // if (this.props.location.hash !== "") {
        //     this.props.history.push(this.props.location.pathname);
        // }
    // }

    // activeParser = function() {
    //     // console.log("this.props.datasets", this.props.datasets);
    //     return this.props.datasets.dataParsers[this.state.activeDataRowIndex];
    // }

    render() {
        // var user = this.state.user || {};
        // var datasets = this.props.datasets.datasets || [];
        // console.log("state", this.state);
        var areDatasetsLoaded = Object.keys(this.props.datasets).length > 0;

        if (!areDatasetsLoaded) {
            return null;
        }

        console.log("this.state.sidebarSelectedOption", this.state.sidebarSelectedOption);

        return (
          <div className="preview-container">
            {/*{this.state.areUserDatasetsLoaded ?*/}
            <DashboardMenus
              admin={{ userId: this.state.userId }}
              datasets={this.props.datasets}
              sidebarSelectedOption={this.state.sidebarSelectedOption}
              handleSidebarRowClick={this.handleSidebarRowClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)} />

            <div className="dashboard-content">
              <Switch>
                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/dashboard'
                  component={(props) => ( <Dashboard {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/talk-ratio'
                  component={(props) => ( <TalkRatio {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/turn-taking'
                  component={(props) => ( <TurnTaking {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/transcript'
                  component={(props) => ( <Transcript {...props} /> )}
                />
              </Switch>
            </div>
              {/*: null}*/}
            {/*{this.state.areUserDatasetsLoaded ?
              <div className="dashboard-content">
              </div>
            : "not loaded"}*/}

            {/* A <Switch> looks through all its children <Route> elements and
              renders the first one whose path matches the current URL.
              Use a <Switch> any time you have multiple routes,
              but you want only one of them to render at a time. */}

              {/*dashboardRoutes({ userId: this.state.userId }).definitions.map((routeObj, index) => {
                  // console.log("routeObj", routeObj);
                  return (
                      <PrivateRoute
                        exact
                        key={index}
                        path={routeObj.path}
                        component={routeObj.component}
                      />
                  )
              })*/}

          </div>
        )
    }
}

DatasetPreview.propTypes = {
    // auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        datasets: state.datasets,
        admin: state.admin
    }
};

export default withRouter(connect(
    mapStateToProps,
    { listDatasets }
)(DatasetPreview));

// UserDetailsPage.propTypes = {
//     auth: PropTypes.object.isRequired,
//     showUserDetails: PropTypes.func.isRequired,
//     datasets: PropTypes.object.isRequired,
//     admin: PropTypes.object.isRequired,
//     deleteDatasetById: PropTypes.func.isRequired
// }
//
//
// export default withRouter(connect(
//   mapStateToProps,
//   { showUserDetails, listDatasets, deleteDatasetById }
// )(UserDetailsPage));
