import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchUsers } from '../../actions/adminActions';

class AdminPanel extends Component {
    constructor(props) {
        console.log("adminpanel constructor");
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
            <table className="admin-container">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>User Type</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((user) => {
                    return (
                      <tr key={user._id}>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td className="text-center">{user.userType}</td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
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
