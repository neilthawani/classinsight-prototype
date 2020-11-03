import React, { Component } from "react";

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    render() {
        return (
            <div className="admin-panel">
              {(this.props.users || []).map((user) => {
                  console.log("user", user);
                  return (
                    <div key={user._id} className="admin-user">
                      {user.email}
                      {user.username}
                      {user.userType}
                    </div>
                  );
              })}
            </div>
        )
    }
}

export default AdminPanel;
