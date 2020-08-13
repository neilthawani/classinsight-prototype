import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    var isLoggedIn = Object.keys(user).length != 0 ? true : false;

    return (
      <div className="navbar">
        <div className="navbar-logo">
          <Link to="/">Home</Link>
        </div>

        {isLoggedIn ?
          <div className="navbar-dropdown">
            <div className="navbar-dropdown-profile">
              <div className="navbar-dropdown-profile-photo"></div>
              <p className="navbar-dropdown-profile-name">
                {user.name.split(" ")[0]}
              </p>
            </div>
            <ChevronDownIcon color="black" size="48" />

            <div className="navbar-dropdown-menu">
              <div className="navbar-dropdown-menu-item">
                <a className="navbar-dropdown-menu-item-link" onClick={this.onLogoutClick}>
                  Logout
              </a>
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
