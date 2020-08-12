import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    console.log("New user created: ", newUser);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div>
            {/* <div className="col s12" style={{ paddingLeft: "11.250px" }}> */}
              <h4>
                Register below
              </h4>
              <p>
                Already have an account? <BrowserRouter><Link to="/login">Log in</Link></BrowserRouter>
              </p>
            {/* </div> */}
            <form noValidate onSubmit={this.onSubmit}>
              <div>
              <label htmlFor="name">Name</label>
              <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                />  
              </div>
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
              <label htmlFor="password2">Confirm Password</label>
              <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                />
              </div>
              <div>
                <button type="submit">
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
