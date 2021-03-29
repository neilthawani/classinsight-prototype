import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { editUser } from "../../actions/adminActions";
import UserTypes from '../../fixtures/user_types';

class AdminPanelTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditingUser: false,
            errors: {},
            name: props.user.name,
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

    onChange = e => {
        // e.persist();
        // console.log('e.target.id', e.target.id);
        // console.log('e.target.value', e.target.value);
        // console.log('e', e);
        this.setState({ [e.target.id]: e.target.value });
    }

    toggleEditingUser(user) {
        // console.log('toggleEditingUser', user);
        this.setState({
            isEditingUser: user ? user : false
        });
    }

    deleteUser(user, confirmation) {
        this.props.deleteUser(user, confirmation);
    }

    editUser(id) {
        // console.log('edituser this.state', this.state, 'id', id);
        var user = {
            _id: id,
            name: this.state.name,
            email: this.state.email,
            userType: parseInt(this.state.userType, 10)
        }

        this.props.editUser({ user: user });

        this.toggleEditingUser();
    }

    render() {
        var { isCurrentUser, isDeletingUser, user } = this.props;
        var { name, email, userType } = this.state;//this.state.isEditingUser ? this.state.isEditingUser : this.state;
        const { isEditingUser, errors } = this.state;

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
                  <span className="input-field-error-text">{errors.name}</span>
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
                  <span className="input-field-error-text">{errors.email}</span>
                </td>
                <td className="text-center">
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
                </td>
                <td className="admin-table-actions">
                  <span className="btn" onClick={this.toggleEditingUser.bind(this, null)}>
                    Cancel
                  </span>
                  <span className="btn" onClick={this.editUser.bind(this, user._id)}>
                    Save Info
                  </span>
                </td>
              </tr>
            )
        } else if (isDeletingUser) {
            return (
              <tr>
                <td>{name}</td>
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
                  <span className="btn" onClick={this.toggleEditingUser.bind(this, user)}>
                    Edit User Info
                  </span>
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
