import React, { Component } from "react";
import { Link } from "react-router-dom";
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';


class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <div class="navbar-logo">
          <Link to="/">Home</Link>
        </div>

        <div class="navbar-dropdown">
          <div class="navbar-dropdown-photo"></div>
          <ChevronDownIcon color="black" size="48" />

          <div class="navbar-dropdown-menu">
            <div class="navbar-dropdown-menu-item">
              <a class="navbar-dropdown-menu-item-link">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
