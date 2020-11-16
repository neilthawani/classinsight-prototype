import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchUsers, deleteUserById } from '../../actions/adminActions';
import AdminPanelTableRow from './AdminPanelTableRow';
import CreateUserForm from './CreateUserForm';

class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingUser: false,
            isDeletingUser: false,
            userToDelete: {}
        };
    }

    componentDidMount() {
        this.props.fetchUsers();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate");
        // console.log("prevProps", prevProps, "prevState", prevState, "snapshot", snapshot);
        if (prevState.isCreatingUser) {
            this.setState({
                isCreatingUser: false
            });
        }
    }

    static getDerivedStateFromProps(nextProps) {
        console.log("getDerivedStateFromProps");
        // console.log("nextProps", nextProps);
        if (nextProps.users) {
            return ({
                users: nextProps.admin.users,
                // isCreatingUser: false,
                isDeletingUser: false
            });
        }

        return null;
    }

    toggleCreateUser() {
        this.setState({
            isCreatingUser: !this.state.isCreatingUser
        });
    }

    deleteUser(user, confirmation = false) {
        // console.log("user", user, "user._id", user._id);
        // console.log("deleteUser base", user, confirmation);//, this.state.userToDelete);
        // explicit true because context is sent in place of 'confirmation' value
        // on initial "Delete" button" click
        if (confirmation) {
            // console.log("delete", user);
            this.props.deleteUserById(user);
            this.setState({
                userToDelete: {}
            });
        }

        // console.log("ok");

        if (user._id === this.state.userToDelete._id && !confirmation) { // remove confirmation message
            // console.log("remove confirmation message");
            this.setState({
                userToDelete: {}
            });
        } else if (Object.entries(this.state.userToDelete).length === 0) { // set confirmation message
            // console.log("set confirmation message");
            this.setState({
                userToDelete: user
            });
        }
    }

    render() {
        var { users } = this.props.admin;
        // console.log("users", users);

        return (
          <div className="admin">
            <div className="admin-header">
              <span className="btn" onClick={this.toggleCreateUser.bind(this)}>
                {this.state.isCreatingUser ? "Cancel" : "Create new user"}
              </span>

              {this.state.isCreatingUser ?
                <CreateUserForm />
              : ""}
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((user) => {
                    // console.log("isDeletingUser", user._id && (this.state.userToDelete._id === user._id), this.state.userToDelete._id, user._id, "user", user);
                    return (
                      <AdminPanelTableRow
                        key={user._id}
                        user={user}
                        isDeletingUser={user._id && (this.state.userToDelete._id === user._id)}
                        deleteUser={this.deleteUser.bind(this)} />
                    );
                })}
              </tbody>
            </table>
          </div>
        );
    }
}

AdminPanel.propTypes = {
    auth: PropTypes.object.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    deleteUserById: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        admin: state.admin
    }
};

export default connect(
  mapStateToProps,
  { fetchUsers, deleteUserById }
)(AdminPanel);
