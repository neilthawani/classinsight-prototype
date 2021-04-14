import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UserTypes from '../../fixtures/user_types';

class AdminPanelTableRow extends Component {
    constructor(props) {
        super(props);

        // console.log('props.user', props.user);
        this.state = {
            isEditingUser: false,
            errors: {},
            name: props.user.name,
            username: props.user.username,
            email: props.user.email,
            userType: props.user.userType
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        var hasErrors = Object.keys(nextProps.errors).length > 0;
        // console.log('nextProps.errors', nextProps.errors, Object.keys(nextProps.errors));
        if (hasErrors && state.email !== nextProps.user.email) {
            return ({
                errors: nextProps.errors,
                isEditingUser: true
            });
        }

        return null;
    }

    userTypeAsWords(type) {
        return UserTypes.filter(obj => obj.value === type)[0] &&
                UserTypes.filter(obj => obj.value === type)[0].label;
    }

    deleteUser(user, confirmation) {
        this.props.deleteUser(user, confirmation);
    }

    render() {
        var { isCurrentUser, isDeletingUser, user } = this.props;
        var { name, username, email, userType } = this.state;
        const { errors } = this.state;

        if (isDeletingUser) {
            return (
              <tr>
                <td>{name}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td className="text-center">
                  {this.userTypeAsWords(userType)}
                </td>
                <td className="admin-table-actions-confirm">
                  <span className="admin-table-actions-confirm-text">
                    Are you sure?
                  </span>
                  <div className="admin-table-actions-confirm-buttons">
                    <span className="btn" onClick={this.deleteUser.bind(this, user, true)}>
                      Yes, delete
                    </span>
                    <span className="btn" onClick={this.deleteUser.bind(this, user, false)}>
                      No, cancel
                    </span>
                  </div>
                </td>
              </tr>
            )
        } else {
            return (
              <tr>
                <td>
                  {user.name}
                </td>
                <td>
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td className="text-center">
                  {this.userTypeAsWords(user.userType)}
                </td>
                <td className="admin-table-actions">
                  <Link to={{
                    pathname: `/admin/user/${user._id}`,
                    state: {
                        user: user
                    }
                  }}>
                    <span className="btn">Settings and Data</span>
                  </Link>
                  {!isCurrentUser ?
                    <span className="btn" onClick={this.deleteUser.bind(this, user, false)}>
                      Delete
                    </span>
                  : ""}
                </td>
              </tr>
            )
        }
    }
}

AdminPanelTableRow.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
  mapStateToProps,
)(withRouter(AdminPanelTableRow));
