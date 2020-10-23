import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
        var a = listUsers(this);
        // console.log("a", a);
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div>No</div>
            );
        } else {
            return (
                <div className="admin-container">
                  {this.state.users.map((user) => {
                      console.log("user", user);
                  })}
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    // auth: state.auth,
    // errors: state.errors
});

export default connect(
    mapStateToProps,
    { listUsers }
)(withRouter(AdminPanel));

// export default connect(
//   mapStateToProps,
//   { registerUser }
// )(withRouter(Register));
