import React, { Component } from "react";
import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { logoutUser } from "../../actions/authActions";

// import Icon from '@mdi/react';
// import { mdiChevronDown, mdiLogout } from '@mdi/js';

// import ClassInSightLogo from "../../assets/images/classinsight-logo.png";

class Sidebar extends Component {
    // onLogoutClick = e => {
    //     e.preventDefault();
    //     this.props.logoutUser();
    // };

    render() {
        // const { user } = this.props.auth;
        // var isLoggedIn = Object.keys(user).length !== 0 ? true : false;

        return (
          <div className="sidebar">
          content
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
