import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { showUserDetails } from "../../actions/adminActions";
import { listDatasets, deleteDatasetById } from "../../actions/datasetActions";
import UserTypes from '../../fixtures/user_types';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UploadDataForm from './UploadDataForm';
import UserDatasetTableRow from './UserDatasetTableRow';

class UserDetailsPage extends Component {
    constructor(props) {
        super(props);
        // debugger;

        // console.log("user", props.location.state.user);
        // console.log("props", props);
        // debugger;
        // var user = props.location.state && props.location.state.user;
        var userId = props.match.params.id;
        //
        // console.log("props", props);
        // if (!user) {
        //     user = {};
        // }

        this.state = {
            isUploadingData: false,
            userId: userId,
            datasets: [],
            // user: {},
            datasetToDelete: {},
            isLoaded: false
        };
    }

    componentDidMount() {
        this.props.showUserDetails(this.state.userId);
        this.props.listDatasets();
        // var user =

        // console.log("user", this.state.user);
        //
        // this.setState({
        //     user: user
        // });

        // setTimeout(() => {
        //     console.log("componentDidMount here");
        // }, 0)
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log("dom", document.getElementsByClassName("admin-table-json"));
    //     console.log("componentDidUpdate");
    //     console.log("prevProps", prevProps);
    //     console.log("prevState", prevState);
    //     console.log("snapshot", snapshot);
    //     console.log("/componentDidUpdate");
    // }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.admin.user) {
            return ({
                user: nextProps.admin.user,
                // isDeletingUser: false
            });
        }

        // if (nextProps.datasets) {
        //     console.log("nextProps.datasets", nextProps.datasets);
        //     return ({
        //         datasets: nextProps.datasets
        //     })
        // }

        // console.log("nextProps", nextProps);

        return null;
    }

    userTypeAsWords(type) {
        return UserTypes.filter(obj => obj.value === type)[0] &&
                UserTypes.filter(obj => obj.value === type)[0].label;
    }

    toggleUploadData() {
        this.setState({
            isUploadingData: !this.state.isUploadingData
        })
    }

    // appendDataset(dataset) {
    //     this.setState({
    //         datasets: this.state.datasets.push(dataset)
    //     });
    // }

    deleteDataset(dataset, confirmation = false) {
        if (confirmation) {
            // console.log("dataset to be deleted", dataset);
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

    dismountForm() {
        this.setState({
            isUploadingData: false
        });
    }

    render() {
        // console.log("state", this.state);
        // var user = this.state.user || this.props.user || {};
        var user = this.state.user || {};
        // console.log("user", user);
        // console.log("this.state", this.state, this.props);
        // if (!user) return (<div></div>);
        var datasets = this.props.datasets.datasets || [];
        // var isLoading = datasets.length === 0;
        // console.log("UserDetailsPage datasets", datasets);
        // console.log("isLoading", isLoading);

        // console.log("UserDetailsPage props.datasets", datasets);

        return (
          <div className="admin-user">
            <div className="admin-header">
              <span className="btn" onClick={this.toggleUploadData.bind(this)}>
                {this.state.isUploadingData ? "Cancel" : "Upload data"}
              </span>
            </div>

            {this.state.isUploadingData ?
              <UploadDataForm
                userId={user._id}
                dismountForm={this.dismountForm.bind(this)} />
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
                  {/*<th>Data</th>*/}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(datasets || []).map((dataset, index, array) => {
                  // console.log("dataset mapped", dataset, index, array);
                  var isDeletingDataset = dataset._id && (this.state.datasetToDelete._id === dataset._id);
                    // <AdminPanelTableRow
                    //   key={user._id}
                    //   user={user}
                    //   isCurrentUser={isCurrentUser}
                    //   isDeletingUser={isDeletingUser}
                    //   deleteUser={this.deleteUser.bind(this)} />
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

export default connect(
  mapStateToProps,
  { showUserDetails, listDatasets, deleteDatasetById }
)(withRouter(UserDetailsPage));

// function UserInfo(props) {
//     var user = props.user;
//
//     return (
//         <div>
//         </div>
//     )
// }
