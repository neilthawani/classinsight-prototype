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
        // console.log("this.props.admin", this.props.admin);
    }

    render() {
        // console.log("this.props render", this.props.admin.users);
        var { users } = this.props.admin;
        console.log("users", users);
        return (
            <div className="admin-container">

              {(users || []).map((user) => {
                  // console.log("user", user);
                  return (
                    <div key={user._id} className="admin-user">
                      {user.email}
                      {user.username}
                      {user.userType}
                    </div>
                  );
              })}
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
