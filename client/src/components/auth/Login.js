import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import keys from '../../config/keys';
import GoogleLogin from 'react-google-login';
import refreshTokenSetup from '../../utils/refreshToken';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // npx react-codemod rename-unsafe-lifecycles
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
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

    // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    this.props.loginUser(userData);
  };

  onSuccess(res) {
      // console.log("onSuccess", res);
      // dispatch("quick!")
      // debugger;
      refreshTokenSetup(res);
      this.props.handleGoogleLogin(res);
  }

  onFailure(res) {
      console.log("onFailure", res);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="form-container">
        <h2 className="text-center">
          Sign in
        </h2>

        <form noValidate onSubmit={this.onSubmit}>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              onChange={this.onChange}
              value={this.state.email}
              error={errors.email}
              id="email"
              type="email"
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
            clientId={keys.oauth.clientId}
            buttonText="Sign in with Google"
            theme="dark"
            onSuccess={this.onSuccess.bind(this)}
            onFailure={this.onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true} />
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
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
