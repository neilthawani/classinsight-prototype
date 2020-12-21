import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
        console.log("props.location", props.location);
        var userId = props.match.params.userId;

        this.setState({
            // dataset: props.location.state.dataset
        });
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

    render() {
        // var user = this.state.user || {};
        // var datasets = this.props.datasets.datasets || [];

        return (
          <div className="dataset-preview-container">
          </div>
        )
    }
}

export default withRouter(DatasetPreview);

// UserDetailsPage.propTypes = {
//     auth: PropTypes.object.isRequired,
//     showUserDetails: PropTypes.func.isRequired,
//     datasets: PropTypes.object.isRequired,
//     admin: PropTypes.object.isRequired,
//     deleteDatasetById: PropTypes.func.isRequired
// }
//
// function mapStateToProps(state) {
//     return {
//         auth: state.auth,
//         datasets: state.datasets,
//         admin: state.admin
//     }
// };
//
// export default withRouter(connect(
//   mapStateToProps,
//   { showUserDetails, listDatasets, deleteDatasetById }
// )(UserDetailsPage));
