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
        if (prevState.isCreatingUser) {
            this.setState({
                isCreatingUser: false
            });
        }
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
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((user) => {
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
