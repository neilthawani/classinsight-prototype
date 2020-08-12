import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <div className="navbar-fixed-item">
          <BrowserRouter>
            <Link to="/">Home
            </Link>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default Navbar;
