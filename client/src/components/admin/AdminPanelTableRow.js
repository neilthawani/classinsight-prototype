import React, { Component } from "react";

class AdminPanelTableRow extends Component {
    // constructor(props) {
    //     super(props);

        // this.deleteUser = this.props.deleteUser.bind(this);
    // }

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

    deleteUser(user, confirmation) {
        // console.log("deleteUser props", user, confirmation);
        this.props.deleteUser(user, confirmation);
    }

    render() {
        var { user, isDeletingUser } = this.props;

        return (
          <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td className="text-center">
              {this.userTypeAsWords(user.userType)}
            </td>
            {isDeletingUser ?
              <td className="admin-table-actions-confirm">
                <span className="admin-table-actions-confirm-text">
                  Are you sure?
                </span>
                <div className="admin-table-actions-confirm-buttons">
                  <span className="btn" onClick={this.deleteUser.bind(this, user, true)}>
                    Yes, delete
                  </span>
                  <span className="btn" onClick={this.deleteUser.bind(this, user, false)}>
                    No, cancel
                  </span>
                </div>
              </td>
            :
            <td className="admin-table-actions">
              <span className="btn">
                Edit
              </span>
              <span className="btn" onClick={this.deleteUser.bind(this, user, false)}>
                Delete
              </span>
            </td>}
          </tr>
        )
    }
}

export default AdminPanelTableRow;
