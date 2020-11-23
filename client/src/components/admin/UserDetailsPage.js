import React, { Component } from "react";
import UserTypes from '../../fixtures/user_types';
import PropTypes from "prop-types";
import { connect } from "react-redux";

class UserDetailsPage extends Component {
    constructor(props) {
        super(props);
        // debugger;

        console.log("user", props.location.state.user);

        this.state = {
            user: props.location.state.user
        };
    }

    userTypeAsWords(type) {
        return UserTypes.filter(obj => obj.value === type)[0] &&
                UserTypes.filter(obj => obj.value === type)[0].label;
    }
    // componentWillRender

    render() {
        var user = this.state.user;

        return (
          <div className="admin-user">
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
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(
  mapStateToProps,
  {}
)(UserDetailsPage);
