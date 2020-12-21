import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import DashboardMenus from '../../DashboardMenus';
import { listDatasets } from "../../actions/datasetActions";
import { Switch } from "react-router-dom";// import App from '../../App';
import PrivateRoute from "../private-route/PrivateRoute";

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
        super(props);
        // console.log("props.location", props.location);
        console.log("props", props);
        var userId = props.match.params.userId;

        this.state = {
            buttonSelectorSelectedOption: "dashboard",//localStorage.get("buttonSelectorSelectedOption")
            activeDataRowIndex: 0,
            userId: userId,
            areDatasetsLoaded: false

            // dataset: props.location.state.dataset
        };

        // console.log("app.adminPreviewRoutes", new App().adminPreviewRoutes());
        //
        // var userId = props.match.params.id;
        //
        // this.state = {
        //     isUploadingData: false,
        //     isResettingPassword: false,
        //     userId: userId,
        //     datasets: [],
        //     datasetToDelete: {},
        //     isLoaded: false,
        //     showMessage: false,
        //     message: ""
        // };
    }

    // componentDidMount() {
    //     this.props.showUserDetails(this.state.userId);
    //     this.props.listDatasets(this.state.userId);
    // }
    //
    // static getDerivedStateFromProps(nextProps) {
    //     if (nextProps.admin.user) {
    //         return ({
    //             user: nextProps.admin.user
    //         });
    //     }
    //
    //     return null;
    // }
    //
    // // TODO: put this into a util function?
    // userTypeAsWords(type) {
    //     return UserTypes.filter(obj => obj.value === type)[0] &&
    //             UserTypes.filter(obj => obj.value === type)[0].label;
    // }
    //
    // toggleUploadData() {
    //     console.log("toggleUploadData");
    //     this.setState(prevState => ({
    //         isUploadingData: !prevState.isUploadingData
    //     }));
    // }
    //
    // toggleResetPassword() {
    //     console.log("toggleResetPassword");
    //     this.setState(prevState => ({
    //         isResettingPassword: !this.state.isResettingPassword
    //     }));
    // }
    //
    // deleteDataset(dataset, confirmation = false) {
    //     if (confirmation) {
    //         this.props.deleteDatasetById(dataset);
    //         this.setState({
    //             datasetToDelete: {}
    //         });
    //     }
    //
    //     if (dataset._id === this.state.datasetToDelete._id && !confirmation) { // remove confirmation message
    //         this.setState({
    //             datasetToDelete: {}
    //         });
    //     } else if (Object.entries(this.state.datasetToDelete).length === 0) { // set confirmation message
    //         this.setState({
    //             datasetToDelete: dataset
    //         });
    //     }
    // }
    //
    // dismountForm(options) {
    //     console.log("dismountForm");
    //     var that = this;
    //
    //     if (options && options.message) {
    //         this.setState({
    //             showMessage: true,
    //             message: options.message
    //         });
    //
    //         setTimeout(function() {
    //             that.setState({
    //                 showMessage: false,
    //                 message: ""
    //             });
    //         }, 3000);
    //     }
    //
    //     this.setState({
    //         isUploadingData: false,
    //         isResettingPassword: false
    //     });
    // }
    handleButtonSelectorClick(value) {
        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    handleSidebarRowClick(index) {
        this.setState({
            activeDataRowIndex: index
        });
        //
        // if (this.props.location.hash !== "") {
        //     this.props.history.push(this.props.location.pathname);
        // }
    }

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
              activeDataRowIndex={this.state.activeDataRowIndex}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
              handleSidebarRowClick={this.handleSidebarRowClick.bind(this)} /> : ""}

            {this.state.areDatasetsLoaded ?
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
            : ""}
          </div>
        )
    }
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
