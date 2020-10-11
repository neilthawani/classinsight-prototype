import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import Icon from '@mdi/react';
import { mdiChevronDown, mdiLogout } from '@mdi/js';

import ClassInSightLogo from "../../assets/images/classinsight-logo.png";

class Navbar extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        const { user } = this.props.auth;
        var isLoggedIn = Object.keys(user).length !== 0 ? true : false;

        return (
          <div className="navbar">
            <div className="navbar-logo">
              {/*<Link to="/">*/}
                <img src={ClassInSightLogo} alt="ClassInSight Logo" height="50"/>
              {/*</Link>*/}
            </div>

            {isLoggedIn ?
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-profile">
                  <div className="navbar-dropdown-profile-photo"></div>
                  <p className="navbar-dropdown-profile-name">
                    {user.name}
                  </p>
                </div>
                <Icon path={mdiChevronDown} className="navbar-dropdown-icon" size={1} />

                <div className="navbar-dropdown-menu">
                  <div className="navbar-dropdown-menu-item">
                    <Icon path={mdiLogout} className="navbar-dropdown-menu-item-icon" size={1} />
                    <span className="navbar-dropdown-menu-item-link" onClick={this.onLogoutClick}>
                       Logout
                    </span>
                  </div>
                </div>
              </div> : ''
            }

          </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Navbar);
