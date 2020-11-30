import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getUser } from "../../actions/adminActions";
import UserTypes from '../../fixtures/user_types';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UploadDataForm from './UploadDataForm';

class UserDetailsPage extends Component {
    constructor(props) {
        super(props);
        // debugger;

        // console.log("user", props.location.state.user);
        console.log("props", props);
        // debugger;
        // var user = props.location.state && props.location.state.user;
        var userId = props.match.params.id;
        var user = props.getUser(userId);
        //
        // if (!user) {
        //     user = {};
        // }


        this.state = {
            isUploadingData: false,
            user: user
        };
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

    render() {
        var user = this.state.user;

        return (
          <div className="admin-user">
            <div className="admin-header">
              <span className="btn" onClick={this.toggleUploadData.bind(this)}>
                {this.state.isUploadingData ? "Cancel" : "Upload data"}
              </span>

              {this.state.isUploadingData ?
                <UploadDataForm
                  userId={user._id} />
              : ""}
            </div>
            <span className="admin-user-name">
              {user.name}
            </span>
            <span className="admin-user-email">
              {user.email}
            </span>
            <span className="admin-user-type">
              {this.userTypeAsWords(user.userType)}
            </span>
          </div>
        )
    }
}

UserDetailsPage.propTypes = {
    auth: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(
  mapStateToProps,
  { getUser }
)(withRouter(UserDetailsPage));
