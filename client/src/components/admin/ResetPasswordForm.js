import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetUserPassword } from "../../actions/adminActions";
import classnames from "classnames";

class ResetPasswordForm extends Component {
    constructor(props) {
      super();

      this.state = {
        userId: props.userId,
        password: "",
        password2: "",
        errors: {}
      };
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.errors) {
            return ({
                errors: nextProps.errors
            });
        }

        return null;
    }


    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate", nextProps, nextState);
        // console.log("nextProps.datasets.isValid", nextProps.datasets.isValid)
        // console.log("nextProps.admin && nextProps.admin.passwordResetSuccessful", nextProps.admin && nextProps.admin.passwordResetSuccessful);
        if (nextProps.admin.passwordResetSuccessful) {
            this.dismountForm();
        }

        return true;
    }

    dismountForm() {
        this.props.dismountForm();
    }

    onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
      e.preventDefault();
      console.log("onSubmit");
      const userData = {
          userId: this.state.userId,
          password: this.state.password,
          password2: this.state.password2
      };

      this.props.resetUserPassword(userData);
    };

    render() {
        const { errors } = this.state;

        return (
          <div className="form-container">
            <h2 className="text-center">
              Reset Password
            </h2>

            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <span className="input-field-error-text">{errors.password}</span>
              </div>
              <div className="input-field">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  autoComplete="new-password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <span className="input-field-error-text">{errors.password2}</span>
              </div>
              <button type="submit" className="btn btn-submit">
                Submit
              </button>
            </form>
          </div>
        );
    }
}

ResetPasswordForm.propTypes = {
  resetUserPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  admin: state.admin,
  datasets: state.datasets
});

export default connect(
  mapStateToProps,
  { resetUserPassword }
)(withRouter(ResetPasswordForm));
