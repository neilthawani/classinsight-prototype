import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    console.log('User data: ', userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <div>
        <div>
          <div>
            <div>
              <h4>
                Login below
              </h4>
              <p>
                Don't have an account? <BrowserRouter><Link to="/register">Register</Link></BrowserRouter>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div>
              <label htmlFor="email">Email</label>
              <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                />
              </div>
              <div>
              <label htmlFor="password">Password</label>
              <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                />
              </div>
              <div>
                <button type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
