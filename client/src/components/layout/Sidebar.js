import React, { Component } from "react";

import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listDatasets, showDataset } from "../../actions/datasetActions";

import SidebarGroup from './SidebarGroup';

import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline } from '@mdi/js';

class Sidebar extends Component {
    // handleSidebarRowClick(index) {
    //     console.log("handleSidebarRowClick", index);
    //     // this.props.handleSidebarRowClick(index);
    //
    //     localStorage.setItem("sidebarSelectedOption", index);
    //
    //     this.setState({
    //         sidebarSelectedOption: index
    //     });
    //
    //     localStorage.setItem("activeDataRowIndex", index);
    //
    //     this.props.showDataset(index);

        // console.log("this.props.location.hash", this.props.location.hash);
        //
        // if (this.props.location.pathname.includes("dashboard")) {
        //     console.log("this.props.location", this.props.location);
        //     // this.props.history.push("/visualization/talk-ratio");
        // }
        //
        // if (this.props.location.hash !== "") {
        //     this.props.history.push(this.props.location.pathname);
        // }
    // }

    transitionToDashboard() {
        this.props.history.push("/dashboard");
    }

    componentDidMount() {
        {/*if (typeof this.props.datasets.activeDataRowIndex !== "number") {
            // this.handleSidebarRowClick(0);
        }*/}

        this.props.listDatasets(this.props.auth.user.id);
    }

    // handleSidebarRowClick(value) {
    //     console.log("handleSidebarRowClick", value);
    //
    // }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var isDashboard = this.props.location.pathname.includes("dashboard");

        var { buttonSelectorSelectedOption, sidebarSelectedCourse } = this.props;
        // console.log("isDashboard", isDashboard);

        return (
          <div className="sidebar">
            {/*<div className="sidebar-header-item">&nbsp;</div>*/}
            {/*<Link
              className={isDashboard ? "sidebar-item active" : "sidebar-item"}
              to="/visualization/dashboard"
              onClick={this.transitionToDashboard.bind(this)}>
              <span className="sidebar-item-title">Dashboard</span>
              <Icon path={mdiViewDashboardVariantOutline} className="sidebar-item-icon" size={1} />
            </Link>*/}
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
