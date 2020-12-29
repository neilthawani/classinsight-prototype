import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DashboardMenus from '../../DashboardMenus';
import { listDatasets } from "../../actions/datasetActions";
import { Switch } from "react-router-dom";// import App from '../../App';
import PrivateRoute from "../private-route/PrivateRoute";
import dashboardRoutes from '../../fixtures/dashboardRoutes';

// import Dashboard from "../dashboard/Dashboard";
// import TalkRatio from '../visualizations/talk-ratio/TalkRatio';
// import Transcript from '../visualizations/transcript/Transcript';
// import TurnTaking from '../visualizations/turn-taking/TurnTaking';
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
        console.log("DatasetPreview constructor");
        super(props);
        // console.log("props.location", props.location);
        console.log("props", props);
        var userId = props.match.params.userId;
        // console.log("userId", userId);

        this.state = {
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            userId: userId,
            areUserDatasetsLoaded: false,
            datasets: props.datasets

            // dataset: props.location.state.dataset
        };
    }


    componentDidMount() {
        console.log("DatasetPreview componentDidMount");
        // console.log("DatasetPreview props", this.props);
        // localStorage.setItem("datasets", JSON.stringify(this.props.datasets));
        // if (!this.state.areUserDatasetsLoaded) {
        //     // console.log("are not loaded", this.state.userId);
        this.props.listDatasets(this.state.userId);
        //         console.log("res", res);
                // this.setState({
                //     areUserDatasetsLoaded: true
                // });

                // this.props.history.push(`${this.state.buttonSelectorSelectedOption}`);
            // })
            // .catch(error => {
            //     console.error(error);
            // });
        // }
    }

    handleButtonSelectorClick(value) {
        console.log("DatasetPreview handleButtonSelectorClick", value);
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


        return (
          <div className="preview-container">
            <DashboardMenus
              admin={{ userId: this.state.userId }}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              dataParsers={this.props.datasets.dataParsers}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)} /> : ""}

            {this.state.areUserDatasetsLoaded ?
              <div className="dashboard-content">
              </div>
            : "not loaded"}

            {/* A <Switch> looks through all its children <Route> elements and
              renders the first one whose path matches the current URL.
              Use a <Switch> any time you have multiple routes,
              but you want only one of them to render at a time. */}
            {/*<Switch>*/}
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
            {/*</Switch>*/}
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
