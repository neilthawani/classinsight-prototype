import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div class="landing-container">
        <Link to="/register">
          Register
        </Link>
        <Link to="/login">
          Log In
        </Link>
      </div>
    );
  }
}

export default Landing;
