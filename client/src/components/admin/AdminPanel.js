import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchUsers } from '../../actions/adminActions';
import CreateUserForm from './CreateUserForm';

class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingUser: false,
        };
    }

    componentDidMount() {
        this.props.fetchUsers();
    }

    toggleCreateUser() {
        this.setState({
            isCreatingUser: !this.state.isCreatingUser
        });
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

    render() {
        var { users } = this.props.admin;

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
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td className="text-center">
                          {this.userTypeAsWords(user.userType)}
                        </td>
                        <td>
                          Edit
                          Delete
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        );
    }
}

AdminPanel.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        admin: state.admin
    }
};

export default connect(
  mapStateToProps,
  { fetchUsers}
)(AdminPanel);
