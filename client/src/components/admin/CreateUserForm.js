import React, { Component } from "react";
import classnames from "classnames";
import { /*Link,*/ withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { registerUser } from "../../actions/authActions";
import { createUser } from '../../actions/adminActions';

class CreateUserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    // npx react-codemod rename-unsafe-lifecycles
    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps);
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.createUser(newUser, this.props.history);
    };

    render() {
        const { errors } = this.state;

        return (
          <div className="form-container">
            <h2 className="text-center">
              Create new user
            </h2>

            <form noValidate onSubmit={this.onSubmit}>
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
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <span className="input-field-error-text">{errors.email}</span>
              </div>
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
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
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <span className="input-field-error-text">{errors.password2}</span>
              </div>

              <button type="submit" className="btn btn-submit">
                Create user
              </button>
            </form>
          </div>
        )
    }
}

CreateUserForm.propTypes = {
    createUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
  mapStateToProps,
  { createUser }
)(withRouter(CreateUserForm));
