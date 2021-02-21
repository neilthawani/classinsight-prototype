import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listDatasets } from "../actions/datasetActions";

class Landing extends Component {
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.listDatasets(this.props.auth.user.id);
      this.props.history.push("/visualization/dashboard");
    }
  }

  render() {
    return (
      <div className="auth-form-container form-container">
        <Link to="/register" className="btn">
          Register
        </Link>
        <Link to="/login" className="btn">
          Log In
        </Link>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  datasets: state.datasets
});

export default withRouter(connect(
  mapStateToProps,
  { listDatasets }
)(Landing));
