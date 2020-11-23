import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class UploadDataForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filename: "",
            topic: "",
            date: "",
            period: 0,
            jsonData: "",
            errors: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors) {
            return ({
                errors: nextProps.errors
            });
        }

        return null;
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();

        const newUser = {
            filename: this.state.filename,
            topic: this.state.name,
            date: this.state.email,
            period: this.state.userType,
            jsonData: this.state.jsonData
        };

        this.props.createUser(newUser);
    };

    render() {
        const { errors } = this.state;

        return (
          <div className="form-container">
            <div className="form-header">
              <h2>
                Upload data
              </h2>
            </div>

            {/*<form noValidate onSubmit={this.onSubmit}>
              <div className="input-field">
                <label htmlFor="name">Name</label>
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <span className="input-field-error-text">{errors.name}</span>
              </div>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  autoComplete="username"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <span className="input-field-error-text">{errors.email}</span>
              </div>

              <div className="input-field">
                <label htmlFor="userType">User Type</label>
                <select
                  name="userType"
                  id="userType"
                  onChange={this.onChange}
                  value={this.state.userType}>

                  {UserTypes.map((type, index) => {
                      return (
                        <option key={index} name={type.value} id={type.value} value={type.value}>{type.label}</option>
                      )
                  })}
                </select>
              </div>

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
                Create user
              </button>
            </form>*/}
          </div>
        )
    }
}

UploadDataForm.propTypes = {
    // createUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(
  mapStateToProps,
  {  }
)(withRouter(UploadDataForm));
