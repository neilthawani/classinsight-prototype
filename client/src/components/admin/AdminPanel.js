import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchUsers } from '../../actions/adminActions';

class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showUsers: false
        }
    }

    componentDidMount() {
        this.props.fetchUsers();
    }

    render() {
        var { users } = this.props.admin;

        return (
          <div className="admin-container">
            <div className="btn text-right">Create new user</div>
            <table className="admin-panel-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((user) => {
                    return (
                      <tr key={user._id}>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td className="text-center">{user.userType}</td>
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
