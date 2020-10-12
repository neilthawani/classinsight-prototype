import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { logoutUser } from "../../actions/authActions";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

// import ClassInSightLogo from "../../assets/images/classinsight-logo.png";

class Sidebar extends Component {
    // constructor(props) {
    //     super(props);

        // console.log("props", props);
    // }
    // onLogoutClick = e => {
    //     e.preventDefault();
    //     this.props.logoutUser();
    // };

    handleDataRowClick(index) {
        this.props.handleDataRowClick(index);
    }

    render() {
        // const { user } = this.props.auth;
        // var isLoggedIn = Object.keys(user).length !== 0 ? true : false;
        return (
          <div className="sidebar">
            <div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>
            <div className="sidebar-data">
              {this.props.dataRows.map((item, index, array) => {
                  // if (index > 0) return;
                  var datum = item.data;
                  // console.log("item", item);
                  // console.log("item.id", item.id, "this.props.activeDataRowId", this.props.activeDataRowId);
                  return (
                    <div key={index}
                      className={this.props.activeDataRowId === index ? "sidebar-data-row active" : "sidebar-data-row"}
                      onClick={this.handleDataRowClick.bind(this, index)}>
                      <div className="sidebar-data-row-title">
                        {datum.title}
                      </div>

                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Filename:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {datum.original_csv}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Duration:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {new Date(datum.duration * 1000).toISOString().substr(11, 8)}
                        </span>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        );
    }
}

// Navbar.propTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//     auth: state.auth
// });

// export default connect(
//     mapStateToProps,
//     { logoutUser }
// )(Navbar);
export default Sidebar;
