import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { showUserDetails } from "../../actions/adminActions";
import { listDatasets, deleteDatasetById, clearValidState } from "../../actions/datasetActions";
import classnames from "classnames";
import UserTypes from '../../fixtures/user_types';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UploadCsvDataForm from './UploadCsvDataForm';
import UserDatasetTableRow from './UserDatasetTableRow';
import ResetPasswordForm from './ResetPasswordForm';
import { editUser } from "../../actions/adminActions";

class UserDetailsPage extends Component {
    constructor(props) {
        super(props);

        var userId = props.match.params.userId;
        // console.log('userdetails userId', userId);

        this.state = {
            isUploadingCsvData: false,
            errors: {},
            isResettingPassword: false,
            userId: userId,
            datasets: [],
            datasetToDelete: {},
            isLoaded: false,
            showMessage: false,
            message: "",
            areDatasetsLoaded: false,
            isEditingUser: false,
            name: "",
            username: "",
            email: "",
            userType: ""
        };
    }

    onChange = e => {
        // console.log('onChange', e, e.target.id, e.target.value);
        // e.persist();
        // console.log('e.target.id', e.target.id);
        // console.log('e.target.value', e.target.value);
        // console.log('e', e);
        this.setState({ [e.target.id]: e.target.value });
    }

    componentDidMount() {
        this.props.showUserDetails(this.state.userId);
        if (!this.state.areDatasetsLoaded) {
            this.props.listDatasets(this.state.userId).then((response) => {
                this.setState({
                    areDatasetsLoaded: true
                });
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.admin.user && !prevState.user) {
            // console.log('here oh no');
            var user = nextProps.admin.user;

            return ({
                user: user,
                name: user.name,
                username: user.username,
                email: user.email,
                userType: user.userType
            });
        }

        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate', nextProps, nextState);
        // if (nextProps.admin.userEdited && this.state.isEditingUser) {
        //     // this.toggleEditingUser();
        //     this.setState({
        //         isEditingUser: false
        //     });
        // }

        if (!this.state.isEditingUser && nextProps.errors.userEditingFailed && Object.keys(nextProps.errors).length > 0) {
            this.toggleEditingUser();
        }

        return true;
    }

    // TODO: put this into a util function?
    userTypeAsWords(type) {
        return UserTypes.filter(obj => obj.value === type)[0] &&
                UserTypes.filter(obj => obj.value === type)[0].label;
    }

    toggleUploadCsvData() {
      this.setState(prevState => ({
          isUploadingCsvData: !prevState.isUploadingCsvData
      }));
    }

    toggleResetPassword() {
        this.setState(prevState => ({
            isResettingPassword: !prevState.isResettingPassword
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

    toggleEditingUser() {
      console.log('this.state.isEditingUser', this.state.isEditingUser);
      this.setState(prevState => ({
          isEditingUser: !prevState.isEditingUser
      }));
    }

    editUser(id) {
        // console.log('edituser this.state', this.state, 'id', id);
        var user = {
            _id: id,
            name: this.state.name,
            username: this.state.username,
            email: this.state.email,
            userType: parseInt(this.state.userType, 10)
        }

        this.props.editUser({ user: user });

        this.toggleEditingUser();
    }

    dismountForm(options) {
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
        } else {
            this.props.clearValidState();
        }

        this.setState({
            isUploadingCsvData: false,
            isResettingPassword: false,
            isEditingUser: false
        });
    }

    render() {
        var user = this.state.user || {};
        var datasets = this.props.datasets.datasets || [];
        const { errors } = this.props;
        const { isEditingUser } = this.state;
        var { name, username, email, userType } = this.state || {};//this.state.isEditingUser ?
        var userId = this.state.user?._id || "";
        // console.log('name', name);
        // console.log('errors', errors);

        return (
          <div className="admin-user">
            <div className="admin-header">
              <Link to={{
                pathname: `/admin/user/${this.state.userId}/preview/dashboard`
              }}>
                <span className="btn">
                  Preview Teacher View
                </span>
              </Link>

              <span
                className={(this.state.isResettingPassword || this.isUploadingCsvData) ? "hidden" : "btn"}
                onClick={this.toggleEditingUser.bind(this)}>
                {this.state.isEditingUser ? "Cancel" : "Edit User Fields"}
              </span>

              {this.state.isEditingUser ?
                <span
                  className="btn"
                  onClick={this.editUser.bind(this, userId)}>
                  Save User
                </span>
              : ""}

              <span
                className={(this.state.isResettingPassword || this.state.isEditingUser) ? "hidden" : "btn"}
                onClick={this.toggleUploadCsvData.bind(this)}>
                {this.state.isUploadingCsvData ? "Cancel" : "Upload CSV data"}
              </span>

              <span
                className={(this.state.isUploadingCsvData || this.state.isEditingUser) ? "hidden" : "btn"}
                onClick={this.toggleResetPassword.bind(this)}>
                {this.state.isResettingPassword ? "Cancel" : "Reset password"}
              </span>
            </div>

            {this.state.isUploadingCsvData ?
              <UploadCsvDataForm
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
                {isEditingUser ?
                  <span className="admin-user-info-name">
                    <input
                      onChange={this.onChange}
                      placeholder="Name"
                      value={name}
                      error={errors.name}
                      id="name"
                      type="text"
                      className={classnames("", {
                        invalid: errors.name
                      })}
                    />
                    <span className="input-field-error-text">{errors.name}</span>
                  </span>
                :
                <span className="admin-user-info-name">
                  {name}
                </span>
                }
                {isEditingUser ?
                  <span className="admin-user-info-username">
                    <input
                      onChange={this.onChange}
                      placeholder="Username"
                      value={username}
                      error={errors.username}
                      id="username"
                      type="username"
                      className={classnames("", {
                        invalid: errors.username
                      })}
                    />
                    <span className="input-field-error-text">{errors.username}</span>
                  </span>
                :
                <span className="admin-user-info-username">
                  {username}
                </span>
                }
                {isEditingUser ?
                  <span className="admin-user-info-email">
                    <input
                      onChange={this.onChange}
                      placeholder="Email"
                      value={email}
                      error={errors.email}
                      id="email"
                      type="email"
                      className={classnames("", {
                        invalid: errors.email
                      })}
                    />
                    <span className="input-field-error-text">{errors.email}</span>
                  </span>
                :
                <span className="admin-user-info-email">
                  {email}
                </span>
                }
                {isEditingUser ?
                  <span className="admin-user-info-type">
                    <select
                      name="userType"
                      id="userType"
                      onChange={this.onChange}
                      value={userType}>

                      {UserTypes.map((type, index) => {
                          return (
                            <option key={index} name={type.value} id={type.value} value={type.value}>{type.label}</option>
                          )
                      })}
                    </select>
                  </span>
                :
                <span className="admin-user-info-type">
                  {this.userTypeAsWords(userType)}
                </span>
                }
            </div>

            <table className="admin-table-user">
              <thead>
                <tr>
                  <th>Class Topic</th>
                  <th>Date</th>
                  <th>Period(s)</th>
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
                datasets.map((dataset, index, array) => {
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
    listDatasets: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    deleteDatasetById: PropTypes.func.isRequired,
    clearValidState: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        datasets: state.datasets,
        errors: state.errors,
        admin: state.admin
    }
};

export default withRouter(connect(
  mapStateToProps,
  { showUserDetails, listDatasets, deleteDatasetById, clearValidState, editUser }
)(UserDetailsPage));

// Next:
// Add input/edit fields for fields being edited - hopefully just a copy/paste
// original toggleEditingUser receives null on cancel - how to adapt?
// test edit works successfully

// if (isEditingUser) {
//     return (
//       <tr>
//         <td>
//           <input
//             onChange={this.onChange}
//             value={name}
//             error={errors.name}
//             id="name"
//             type="text"
//             className={classnames("", {
//               invalid: errors.name
//             })}
//           />
//           <span className="input-field-error-text">{errors.name}</span>
//         </td>
//         <td>
//           <input
//             onChange={this.onChange}
//             value={username}
//             error={errors.username}
//             id="username"
//             type="username"
//             className={classnames("", {
//               invalid: errors.username
//             })}
//           />
//           <span className="input-field-error-text">{errors.username}</span>
//         </td>
//         <td>
//           <input
//             onChange={this.onChange}
//             value={email}
//             error={errors.email}
//             id="email"
//             type="email"
//             className={classnames("", {
//               invalid: errors.email
//             })}
//           />
//           <span className="input-field-error-text">{errors.email}</span>
//         </td>
//         <td className="text-center">
//           <select
//             name="userType"
//             id="userType"
//             onChange={this.onChange}
//             value={userType}>
//
//             {UserTypes.map((type, index) => {
//                 return (
//                   <option key={index} name={type.value} id={type.value} value={type.value}>{type.label}</option>
//                 )
//             })}
//           </select>
//         </td>
//         <td className="admin-table-actions">
//           <span className="btn" onClick={this.toggleEditingUser.bind(this, null)}>
//             Cancel
//           </span>
//           <span className="btn" onClick={this.editUser.bind(this, user._id)}>
//             Save Info
//           </span>
//         </td>
//       </tr>
//     )
// } else
