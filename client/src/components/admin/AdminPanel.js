import React, { Component } from "react";
import axios from "axios";
// import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listUsers } from '../actions/adminActions';

class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            isLoaded: false
        };
    }

    componentDidMount() {
        // var that = this;
        // console.log("listUsers", listUsers);
        axios.get("/api/users/list")
            .then(res => {
                console.log("adminActions res", res);
                this.setState({
                    users: res.data
                });
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
                  {this.state.users.map((user) => {
                      console.log("user", user);
                      return (
                        <div key={user._id} className="admin-user">
                          {user.email}
                          {user.username}
                          {user.userType}
                        </div>
                      );
                  })}
                  Admin
                </div>
            );
        // }
    }
}

// const mapStateToProps = state => ({
    // auth: state.auth,
    // errors: state.errors
// });

export default AdminPanel;
// export default connect(
//     mapStateToProps,
//     { listUsers }
// )(AdminPanel);

// export default connect(
//   mapStateToProps,
//   { registerUser }
// )(withRouter(Register));
