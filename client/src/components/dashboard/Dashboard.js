import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Dashboard extends Component {
    // constructor(props) {
    //     super(props);
    // }
    //
    // componentDidMount() {
    //
    // }
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

          </div>
        );
    }
}

// export default Dashboard;

Dashboard.propTypes = {
    // auth: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    // showDataset: PropTypes.func.isRequired,
    // listDatasets: PropTypes.func.isRequired
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
