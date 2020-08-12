import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div>
        <div>
          <BrowserRouter>
            <Link to="/register">
              Register
                </Link>
          </BrowserRouter>
        </div>
        <div>
          <BrowserRouter>
            <Link to="/login">
              Log In
                </Link>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default Landing;
