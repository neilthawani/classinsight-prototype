import React, { Component } from "react";
import AdminPanel from './AdminPanel';
import PropTypes from "prop-types";
// import axios from "axios";
// import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUsers } from '../../actions/adminActions';

class AdminPanelContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: {}
        };
    }

    componentDidMount() {
        this.props.fetchUsers();
        console.log("this.props.admin", this.props.admin);
        // var that = this;
        // console.log("listUsers", listUsers);
        // var users = fetchUsers();
        // this.props.admin.dispatch(fetchUsers());
        // console.log("users", a);
        // this.setState({
        //     users: users
        // });
        // console.log("a", a);
    }

    render() {
        // if (!this.state.isLoaded) {
        //     return (
        //         <div>No</div>
        //     );
        // } else {
        // console.log("admin", this.props.admin);
            return (
                <div className="admin-container">
                  <AdminPanel users={this.props.users} />
                </div>
            );
        // }
    }
}

AdminPanelContainer.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    admin: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        admin: state.admin
        // users: state.users,
        // errors: state.errors
    }
};

// export default connect(
//     mapStateToProps,
//     { fetchUsers }
// )(AdminPanelContainer);

export default connect(
  mapStateToProps,
  { fetchUsers}
)(AdminPanelContainer);

// export default connect(
//   mapStateToProps,
//   { loginUser }
// )(Login);
