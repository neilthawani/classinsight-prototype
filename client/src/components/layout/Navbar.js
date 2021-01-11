import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Icon from '@mdi/react';
import { mdiAccount, mdiChevronDown, mdiBadgeAccountHorizontalOutline, mdiLogout } from '@mdi/js';
import { GoogleLogout } from 'react-google-login';
import oauth from '../../config/oauth';

import ClassInSightLogo from "../../assets/images/classinsight-logo.png";

class Navbar extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onGoogleLogoutSuccess(res) {
        this.props.logoutUser();
    }

    render() {
        const { user } = this.props.auth;
        var isAdmin = user.userType === 100;
        var isLoggedIn = Object.keys(user).length !== 0 ? true : false;

        return (
          <div className="navbar">
            <div className="navbar-logo">
              <Link
                to={{
                  pathname: "/"
                }}>
                <img src={ClassInSightLogo} alt="ClassInSight Logo" height="50"/>
              </Link>
            </div>

            {isLoggedIn ?
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-profile">
                  <div className="navbar-dropdown-profile-photo">
                    <Icon path={mdiAccount} className="navbar-dropdown-icon" size={1.5} />
                  </div>
                  <p className="navbar-dropdown-profile-name">
                    {user.name}
                  </p>
                </div>
                <Icon path={mdiChevronDown} className="navbar-dropdown-icon" size={1} />

                <div className="navbar-dropdown-menu">
                  {isAdmin ?
                  <Link to="/admin">
                    <div className="navbar-dropdown-menu-item">
                      <Icon path={mdiBadgeAccountHorizontalOutline} className="navbar-dropdown-menu-item-icon" size={1} />
                      <span className="navbar-dropdown-menu-item-link">
                         Manage Users
                      </span>
                    </div>
                  </Link> : ""}
                  
                  {!this.props.auth.user.isGoogleUser ?
                    <div className="navbar-dropdown-menu-item">
                      <Icon path={mdiLogout} className="navbar-dropdown-menu-item-icon" size={1} />
                      <span className="navbar-dropdown-menu-item-link" onClick={this.onLogoutClick}>
                         Logout
                      </span>
                    </div>
                  :
                    <div className="navbar-dropdown-menu-item">
                      <Icon path={mdiLogout} className="navbar-dropdown-menu-item-icon" size={1} />
                      <GoogleLogout
                        clientId={oauth.clientId}
                        render={renderProps => (
                          <span onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</span>
                        )}
                        buttonText="Logout"
                        onLogoutSuccess={this.onGoogleLogoutSuccess.bind(this)}
                      />
                    </div>
                  }
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
