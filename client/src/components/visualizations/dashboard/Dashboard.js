import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Overview from './Overview';

class Dashboard extends Component {
    render() {
        if (!this.props.datasets.activeParser) {
            return (
              <div className="no-data">
                <h2>Please upload data to use ClassInSight.</h2>
              </div>
            )
        }

        return (
          <div className="dashboard-container">
            {/*<Overview />*/}
          </div>
        );
    }
}

Dashboard.propTypes = {
    datasets: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        datasets: state.datasets
    }
};

export default withRouter(connect(
  mapStateToProps,
  {}
)(Dashboard));
