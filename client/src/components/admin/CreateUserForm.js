import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createUser } from '../../actions/adminActions';
import Adjectives from '../../fixtures/adjectives';
import Nouns from '../../fixtures/nouns';
import Icon from '@mdi/react';
import { mdiGooglePlus } from '@mdi/js';
import generateRandomNumber from '../../utils/generateRandomNumber';
import UserTypes from '../../fixtures/user_types';

const CREATE_GOOGLE_ACCOUNT_URL = 'https://accounts.google.com/signup/v2/webcreateaccount?continue=https%3A%2F%2Faccounts.google.com%2FManageAccount%3Fnc%3D1&dsh=S2114698834%3A1605300939529596&gmb=exp&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp&nogm=true';

class CreateUserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            userType: 50,
            password: "",
            password2: "",
            errors: {},
            emailCopied: false
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
            name: this.state.name,
            email: this.state.email,
            userType: this.state.userType,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.createUser(newUser);
    };

    generateGmailUsername() {
        var adjective = Adjectives[Math.floor(Math.random() * Adjectives.length)];
        var noun = Nouns[Math.floor(Math.random() * Nouns.length)];
        var number = generateRandomNumber(100, 999);
        var username = `${adjective}${noun}${number}`;

        navigator.clipboard.writeText(username);

        this.setState({
            name: username,
            email: `${username}@gmail.com`,
            emailCopied: true
        });
    }

    render() {
        const { errors } = this.state;

        return (
          <div className="form-container">
            <div className="form-header">
              <h2>
                Create new user
              </h2>
              <Icon
                className="icon"
                path={mdiGooglePlus}
                title="Create Gmail account"
                size={1.5}
                color={"#0363f3"}
                onClick={this.generateGmailUsername.bind(this)} />
            </div>

            {this.state.emailCopied ?
              <span className="form-confirmation">
                <a href={CREATE_GOOGLE_ACCOUNT_URL} target="_blank" rel="noopener noreferrer">
                  Username copied to clipboard. Click here to create a Google account.
                </a>
              </span>
            : ''}

            <form noValidate>
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

              <button type="submit" className="btn btn-submit" onClick={this.onSubmit.bind(this)}>
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
    errors: state.errors,
});

export default connect(
  mapStateToProps,
  { createUser }
)(withRouter(CreateUserForm));
