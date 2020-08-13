import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div className="form-container">
        <Link to="/register" className="btn">
          Register
        </Link>
        <Link to="/login" className="btn">
          Log In
        </Link>
      </div>
    );
  }
}

export default Landing;
