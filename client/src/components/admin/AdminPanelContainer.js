import React, { Component } from "react";
import AdminPanel from './AdminPanel';
import axios from "axios";
// import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listUsers } from '../../actions/adminActions';

class AdminPanelContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount() {
        // var that = this;
        // console.log("listUsers", listUsers);
        var users = listUsers();
        console.log("users", users);
        this.setState({
            users: users
        });
        // console.log("a", a);
    }

    render() {
        // if (!this.state.isLoaded) {
        //     return (
        //         <div>No</div>
        //     );
        // } else {
            return (
                <div className="admin-container">
                  <AdminPanel users={this.state.users} />
                </div>
            );
        // }
    }
}

// const mapStateToProps = state => ({
    // auth: state.auth,
    // errors: state.errors
// });

export default AdminPanelContainer;
// export default connect(
//     mapStateToProps,
//     { listUsers }
// )(AdminPanel);

// export default connect(
//   mapStateToProps,
//   { registerUser }
// )(withRouter(Register));
