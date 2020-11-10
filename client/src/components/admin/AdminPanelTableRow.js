import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { editUser } from "../../actions/adminActions";

class AdminPanelTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditingUser: false,
            errors: {}
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.errors) {
        this.setState({
          errors: nextProps.errors
        });
      }      
    }

    userTypeAsWords(type) {
        var userTypeAsWords = "Teacher";

        switch (type) {
            case 100:
                userTypeAsWords = "ClassInSight Researcher";
                break;
            case 75:
                userTypeAsWords = "External Researcher";
                break;
            case 50:
            default:
                userTypeAsWords = "Teacher";
                break;
        }

        return userTypeAsWords;
    }

    onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
    }

    toggleEditingUser(user) {
        console.log("toggleEditingUser", user);
        this.setState({
            isEditingUser: user ? true : false
        });
    }

    deleteUser(user, confirmation) {
        // console.log("deleteUser props", user, confirmation);
        this.props.deleteUser(user, confirmation);
    }

    editUser(user) {
        console.log('action');
    }

    render() {
        var { user, isEditingUser, isDeletingUser } = this.props;
        var { name, email } = user;
        const { errors } = this.state;

        if (isEditingUser) {
            return (
              <tr>
                <td>
                  <input
                    onChange={this.onChange}
                    value={name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className={classnames("", {
                      invalid: errors.name
                    })}
                  />
                </td>
                <td>
                  <input
                    onChange={this.onChange}
                    value={email}
                    error={errors.email}
                    id="email"
                    type="email"
                    className={classnames("", {
                      invalid: errors.email
                    })}
                  />
                </td>
                <td className="text-center">
                  {this.userTypeAsWords(user.userType)}
                </td>
                <td className="admin-table-actions">
                  <span className="btn" onClick={this.toggleEditingUser.bind(this, null)}>
                    Cancel
                  </span>
                  <span className="btn" onClick={this.editUser.bind(this, user)}>
                    Save user
                  </span>
                </td>
              </tr>
            )
        } else if (isDeletingUser) {
            return (
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="text-center">
                  {this.userTypeAsWords(user.userType)}
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
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="text-center">
                  {this.userTypeAsWords(user.userType)}
                </td>
                <td className="admin-table-actions">
                  <span className="btn" onClick={this.toggleEditingUser.bind(this, user)}>
                    Edit
                  </span>
                  <span className="btn" onClick={this.deleteUser.bind(this, user, false)}>
                    Delete
                  </span>
                </td>
              </tr>
            )
        }
    }
}

AdminPanelTableRow.propTypes = {
    editUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
  mapStateToProps,
  { editUser }
)(withRouter(AdminPanelTableRow));
