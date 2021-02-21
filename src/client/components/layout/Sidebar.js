import React, { Component } from "react";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listDatasets, showDataset } from "../../actions/datasetActions";

import SidebarGroup from './SidebarGroup';

class Sidebar extends Component {
    transitionToDashboard() {
        this.props.history.push("/dashboard");
    }

    render() {
        // Note 1/31/21: Leave this here for now in case something breaks.
        // var areDatasetsLoaded = this.props.datasets.activeParser;
        //
        // if (!areDatasetsLoaded) {
        //     return null;
        // }

        var isDashboard = this.props.location.pathname.includes("dashboard");

        var { buttonSelectorSelectedOption, sidebarSelectedCourse } = this.props;

        return (
          <div className="sidebar">
            <SidebarGroup
              label="Courses"
              hideActive={isDashboard}
              buttonSelectorSelectedOption={buttonSelectorSelectedOption}
              sidebarSelectedCourse={sidebarSelectedCourse}
              handleSidebarRowCourseClick={this.props.handleSidebarRowCourseClick.bind(this)}
              />
          </div>
        );
    }
}

Sidebar.propTypes = {
    auth: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    showDataset: PropTypes.func.isRequired,
    listDatasets: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
        auth: state.auth
    }
};

export default withRouter(connect(
  mapStateToProps,
  { showDataset, listDatasets }
)(Sidebar));
