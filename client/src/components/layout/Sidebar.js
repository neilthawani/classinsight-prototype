import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { logoutUser } from "../../actions/authActions";
import data_tom from '../../data/data_tom';
import data_kim from '../../data/data_kim';

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

// import ClassInSightLogo from "../../assets/images/classinsight-logo.png";

class Sidebar extends Component {
    // onLogoutClick = e => {
    //     e.preventDefault();
    //     this.props.logoutUser();
    // };

    handleDataRowClick(row) {
        this.props.handleDataRowClick(row);
    }

    dataRows = [data_tom[0], data_kim[0]];

    render() {
        // const { user } = this.props.auth;
        // var isLoggedIn = Object.keys(user).length !== 0 ? true : false;
        return (
          <div className="sidebar">
            <div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>
            <div className="sidebar-data">
              {this.dataRows.map((item, index, array) => {
                  // if (index > 0) return;
                  var datum = item.data;
                  // console.log("item", item);
                  return (
                    <div key={index} className="sidebar-data-row">
                      <div className="sidebar-data-row-title">
                        {datum.title}
                      </div>

                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Teacher:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {datum.teacher}
                        </span>
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
