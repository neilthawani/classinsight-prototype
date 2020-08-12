import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import ButtonSelector from '../ButtonSelector';
import VisualizationComponents from '../../fixtures/visualization_components';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    if (!window.localStorage.getItem("buttonSelectorSelectedOption")) {
      window.localStorage.setItem("buttonSelectorSelectedOption", Object.keys(this.components)[0]);
    }

    this.state = {
      selectedOption: window.localStorage.getItem("buttonSelectorSelectedOption")
    };
  }

  components = VisualizationComponents;
  buttonSelectorOptions = Object.keys(this.components);

  handleClick(value) {
    this.setState({
      selectedOption: value
    });

    window.localStorage.setItem("buttonSelectorSelectedOption", value);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    return (
      <div>
        <h4>
          <b>Hey there,</b> {user.name.split(" ")[0]}
          <p>
            You are logged into a full-stack{" "}
            <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
          </p>
        </h4>
        <button onClick={this.onLogoutClick}>
          Logout
        </button>

        <ButtonSelector
          options={this.buttonSelectorOptions}
          selectedOption={this.state.selectedOption}
          onClick={this.handleClick.bind(this)} />

        <div className="visualization">
          {React.createElement(this.components[this.state.selectedOption])}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);