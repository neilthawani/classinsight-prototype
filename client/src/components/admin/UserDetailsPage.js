import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { showUserDetails } from "../../actions/adminActions";
import { listDatasets, deleteDatasetById } from "../../actions/datasetActions";
import UserTypes from '../../fixtures/user_types';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UploadDataForm from './UploadDataForm';
import UserDatasetTableRow from './UserDatasetTableRow';
import ResetPasswordForm from './ResetPasswordForm';

class UserDetailsPage extends Component {
    constructor(props) {
        super(props);

        var userId = props.match.params.userId;

        this.state = {
            isUploadingData: false,
            isResettingPassword: false,
            userId: userId,
            datasets: [],
            datasetToDelete: {},
            isLoaded: false,
            showMessage: false,
            message: ""
        };
    }

    componentDidMount() {
        this.props.showUserDetails(this.state.userId);
        this.props.listDatasets(this.state.userId);
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.admin.user) {
            return ({
                user: nextProps.admin.user
            });
        }

        return null;
    }

    // TODO: put this into a util function?
    userTypeAsWords(type) {
        return UserTypes.filter(obj => obj.value === type)[0] &&
                UserTypes.filter(obj => obj.value === type)[0].label;
    }

    toggleUploadData() {
        console.log("toggleUploadData");
        this.setState(prevState => ({
            isUploadingData: !prevState.isUploadingData
        }));
    }

    toggleResetPassword() {
        console.log("toggleResetPassword");
        this.setState(prevState => ({
            isResettingPassword: !this.state.isResettingPassword
        }));
    }

    deleteDataset(dataset, confirmation = false) {
        if (confirmation) {
            this.props.deleteDatasetById(dataset);
            this.setState({
                datasetToDelete: {}
            });
        }

        if (dataset._id === this.state.datasetToDelete._id && !confirmation) { // remove confirmation message
            this.setState({
                datasetToDelete: {}
            });
        } else if (Object.entries(this.state.datasetToDelete).length === 0) { // set confirmation message
            this.setState({
                datasetToDelete: dataset
            });
        }
    }

    dismountForm(options) {
        console.log("dismountForm");
        var that = this;

        if (options && options.message) {
            this.setState({
                showMessage: true,
                message: options.message
            });

            setTimeout(function() {
                that.setState({
                    showMessage: false,
                    message: ""
                });
            }, 3000);
        }

        this.setState({
            isUploadingData: false,
            isResettingPassword: false
        });
    }

    previewTeacherView() {
        console.log("this.props.dataset.jsonData");
    }

    render() {
        var user = this.state.user || {};
        var datasets = this.props.datasets.datasets || [];

        return (
          <div className="admin-user">
            <div className="admin-header">
              <Link to={{
                pathname: `/admin/user/${this.state.userId}/preview`
              }}>
                <span className="btn" onClick={this.previewTeacherView.bind(this)}>
                  Preview Teacher View
                </span>
              </Link>
              <span
                className={this.state.isResettingPassword ? "hidden" : "btn"}
                onClick={this.toggleUploadData.bind(this)}>
                {this.state.isUploadingData ? "Cancel" : "Upload data"}
              </span>
              <span
                className={this.state.isUploadingData ? "hidden" : "btn"}
                onClick={this.toggleResetPassword.bind(this)}>
                {this.state.isResettingPassword ? "Cancel" : "Reset password"}
              </span>
            </div>

            {this.state.isUploadingData ?
              <UploadDataForm
                userId={user._id}
                dismountForm={this.dismountForm.bind(this)} />
            : ""}

            {this.state.isResettingPassword ?
              <ResetPasswordForm
                userId={user._id}
                dismountForm={this.dismountForm.bind(this)} />
            : ""}

            {this.state.showMessage ?
            <div className="admin-confirmation-message">
              <span className="admin-confirmation-message-text">
                {this.state.message}
              </span>
            </div>
            : ""}

            <div className="admin-user-info">
              <span className="admin-user-info-name">
                {user.name}
              </span>
              <span className="admin-user-info-email">
                {user.email}
              </span>
              <span className="admin-user-info-type">
                {this.userTypeAsWords(user.userType)}
              </span>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Class Topic</th>
                  <th>Date</th>
                  <th>Period</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.length === 0 ?
                <tr>
                  <td colSpan="4" className="text-center">
                    This user doesn't have any datasets.
                  </td>
                </tr> :
                (datasets || []).map((dataset, index, array) => {
                  var isDeletingDataset = dataset._id && (this.state.datasetToDelete._id === dataset._id);

                  return (
                    <UserDatasetTableRow
                      key={dataset._id}
                      dataset={dataset}
                      isDeletingDataset={isDeletingDataset}
                      deleteDataset={this.deleteDataset.bind(this)} />
                  );
                })}
              </tbody>
            </table>
          </div>
        )
    }
}

UserDetailsPage.propTypes = {
    auth: PropTypes.object.isRequired,
    showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    deleteDatasetById: PropTypes.func.isRequired
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
  { showUserDetails, listDatasets, deleteDatasetById }
)(UserDetailsPage));
