import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginWithGoogle } from "../../actions/authActions";
import classnames from "classnames";
import { GoogleLogin } from 'react-google-login';
import oauth from '../../config/oauth';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      usernameOrEmail: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
      // If logged in and user navigates to Login page, should redirect them to dashboard
      if (this.props.auth.isAuthenticated) {
        this.props.history.push("/visualization/dashboard");
      }
  }

  static getDerivedStateFromProps(nextProps) {
      if (nextProps.auth.isAuthenticated) {
          nextProps.history.push("/visualization/dashboard"); // push user to dashboard when they login
      }

      if (nextProps.errors) {
          return ({
              errors: nextProps.errors
          });
      }

      return null;
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      usernameOrEmail: this.state.usernameOrEmail,
      password: this.state.password
    };

    // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    this.props.loginUser(userData);
  };

  onGoogleSuccess(response) {
      console.log("Google login successful");
      this.props.loginWithGoogle(response);
  }
  onGoogleFailure(response) {
      console.err("Google login error: ", response);
      this.props.loginWithGoogle(response);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="auth-form-container form-container">
        <h2 className="text-center">
          Login
        </h2>

        <form noValidate onSubmit={this.onSubmit}>
          <div className="input-field">
            <label htmlFor="usernameOrEmail">Username or email</label>
            <input
              onChange={this.onChange}
              value={this.state.usernameOrEmail}
              error={errors.usernameOrEmail}
              id="usernameOrEmail"
              type="usernameOrEmail"
              autoComplete="username"
              className={classnames("", { invalid: errors.email || errors.emailnotfound })} />
            <span className="input-field-error-text">
              {errors.email}
              {errors.emailnotfound}
            </span>
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              onChange={this.onChange}
              value={this.state.password}
              error={errors.password}
              id="password"
              type="password"
              autoComplete="current-password"
              className={classnames("", { invalid: errors.password || errors.passwordincorrect })}/>
            <span className="input-field-error-text">
              {errors.password}
              {errors.passwordincorrect}
            </span>
          </div>
          <button
            type="submit"
            className="btn btn-submit">
            Login
          </button>
        </form>

        <div className="google-form">
          <div className="google-form-option">
            <div className="google-form-option-line"></div>
            <span className="google-form-option-or">OR</span>
            <div className="google-form-option-line"></div>
          </div>
          <GoogleLogin
            clientId={oauth.clientId}
            buttonText="Sign in with Google"
            theme="dark"
            onSuccess={this.onGoogleSuccess.bind(this)}
            onFailure={this.onGoogleFailure.bind(this)}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          />
        </div>

        <span className="text-with-link">
          Don't have an account? &nbsp;
          <Link to="/register" className="link">Register</Link>
        </span>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginWithGoogle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, loginWithGoogle }
)(Login);
