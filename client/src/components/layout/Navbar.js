import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import LogoutIcon from 'mdi-react/LogoutIcon';
import ClassInSightLogo from "../../assets/images/classinsight-logo.png";
import { GoogleLogout } from 'react-google-login';
import keys from '../../config/keys';

class Navbar extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onSuccess(res) {
        console.log("logout onSuccess", res);
    }

    render() {
        const { user } = this.props.auth;
        var isLoggedIn = Object.keys(user).length !== 0 ? true : false;

        return (
          <div className="navbar">
            <div className="navbar-logo">
              <Link to="/">
                <img src={ClassInSightLogo} alt="ClassInSight Logo" height="50"/>
              </Link>
            </div>

            {isLoggedIn ?
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-profile">
                  <div className="navbar-dropdown-profile-photo"></div>
                  <p className="navbar-dropdown-profile-name">
                    {user.name}
                  </p>
                </div>
                <ChevronDownIcon color="#0363f3" size="24" />

                <div className="navbar-dropdown-menu">
                  <div className="navbar-dropdown-menu-item">
                    <LogoutIcon className="navbar-dropdown-menu-item-icon" color="#777" size="24" />
                    <span className="navbar-dropdown-menu-item-link" onClick={this.onLogoutClick}>
                       Logout
                    </span>
                  </div>
                  <div className="navbar-dropdown-menu-item">
                    <LogoutIcon className="navbar-dropdown-menu-item-icon" color="#777" size="24" />
                    {/*<span className="navbar-dropdown-menu-item-link" onClick={this.onLogoutClick}>
                       <GoogleLogout
                          clientId={keys.oauth.clientId}
                          buttonText="Logout"
                          onLogoutSuccess={this.onSuccess} />
                    </span>*/}
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
