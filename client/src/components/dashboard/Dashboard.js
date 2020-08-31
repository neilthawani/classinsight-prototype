import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    this.props.history.push(`/dashboard/${this.state.selectedOption}`);
  }

  render() {
    return (
      <div></div>
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
