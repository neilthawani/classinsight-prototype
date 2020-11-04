import React, { Component } from "react";
import PropTypes from "prop-types";

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        console.log("AdminPanel props", props);
    }

    render() {
        var { users } = this.props;
        // if (users && users.length === 0) {
        //     return (
        //       <div></div>
        //     )
        // } else {
        //     console.log("adminpanel props", users);
            return (
                <div className="admin-panel">
                  {/*this.props.users.map((user) => {
                      console.log("user", user);
                      return (
                        <div key={user._id} className="admin-user">
                          {user.email}
                          {user.username}
                          {user.userType}
                        </div>
                      );
                  })*/}
                </div>
            )
        // }
    }
}

// AdminPanel.propTypes = {
//     users: PropTypes.array.isRequired
// }

export default AdminPanel;
