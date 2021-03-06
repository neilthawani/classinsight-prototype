import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchUsers, deleteUserById, clearIsValidUser } from '../../actions/adminActions';
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
        if (this.props.auth.user.userType !== 100) {
            this.props.history.push('/');
        }

        this.props.fetchUsers();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.admin.isValidUser && this.state.isCreatingUser) {
            this.toggleCreateUser();
        }

        return true;
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.admin.users) {
            return ({
                users: nextProps.admin.users,
                isDeletingUser: false
            });
        }

        return null;
    }

    toggleCreateUser() {
        if (this.state.isCreatingUser) {
            this.props.clearIsValidUser();
        }

        this.setState({
            isCreatingUser: !this.state.isCreatingUser
        });
    }

    deleteUser(user, confirmation = false) {
        if (confirmation) {
            this.props.deleteUserById(user);
            this.setState({
                userToDelete: {}
            });
        }

        if (user._id === this.state.userToDelete._id && !confirmation) { // remove confirmation message
            this.setState({
                userToDelete: {}
            });
        } else if (Object.entries(this.state.userToDelete).length === 0) { // set confirmation message
            this.setState({
                userToDelete: user
            });
        }
    }

    render() {
        var { users } = this.state;

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
                  <th>Username</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((user, index) => {
                    if (!user) return null;

                    var isCurrentUser = this.props.auth.user.id === user._id,
                        isDeletingUser = user._id && (this.state.userToDelete._id === user._id);

                    return (
                      <AdminPanelTableRow
                        key={index}
                        user={user}
                        isCurrentUser={isCurrentUser}
                        isDeletingUser={isDeletingUser}
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
    datasets: PropTypes.object.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    clearIsValidUser: PropTypes.func.isRequired,
    deleteUserById: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        admin: state.admin,
        datasets: state.datasets
    }
};

export default connect(
  mapStateToProps,
  { fetchUsers, deleteUserById, clearIsValidUser }
)(AdminPanel);
