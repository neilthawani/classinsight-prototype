import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { showUserDetails } from "../../actions/adminActions";
import { listDatasets } from "../../actions/datasetActions";
import UserTypes from '../../fixtures/user_types';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UploadDataForm from './UploadDataForm';

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
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
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
        // console.log("UserDetailsPage datasets", datasets);
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
          </div>
        )
    }
}

UserDetailsPage.propTypes = {
    auth: PropTypes.object.isRequired,
    showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired
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
  { showUserDetails, listDatasets }
)(withRouter(UserDetailsPage));

// function UserInfo(props) {
//     var user = props.user;
//
//     return (
//         <div>
//         </div>
//     )
// }

// var
