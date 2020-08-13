import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

  render() {
    const { user } = this.props.auth;

    return (
      <div className="dashboard-container">
        <ButtonSelector
          options={this.buttonSelectorOptions}
          selectedOption={this.state.selectedOption}
          onClick={this.handleClick.bind(this)} />

        {React.createElement(this.components[this.state.selectedOption])}
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
  mapStateToProps
)(Dashboard);
