import React, { Component } from "react";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listDatasets, showDataset } from "../../actions/datasetActions";

import SidebarGroup from './SidebarGroup';

import Icon from '@mdi/react';
import { mdiViewDashboardVariantOutline } from '@mdi/js';

class Sidebar extends Component {
    handleSidebarRowClick(index) {
        this.props.handleSidebarRowClick(index);

        localStorage.setItem("activeDataRowIndex", index);

        this.props.showDataset(index);

        if (this.props.location.hash !== "") {
            this.props.history.push(this.props.location.pathname);
        }
    }

    transitionToDashboard() {
        this.props.history.push("/dashboard");
    }

    componentDidMount() {
        {/*if (typeof this.props.datasets.activeDataRowIndex !== "number") {
            this.handleSidebarRowClick(0);
        }*/}

        this.props.listDatasets(this.props.auth.user.id);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var isDashboard = this.props.location.pathname.includes("dashboard");

        // console.log("isDashboard", isDashboard);

        return (
          <div className="sidebar">
            <div
              className={isDashboard ? "sidebar-item active" : "sidebar-item"}
              onClick={this.transitionToDashboard.bind(this)}
            >
              <span className="sidebar-item-title">Dashboard</span>
              <Icon path={mdiViewDashboardVariantOutline} className="sidebar-item-icon" size={1} />
            </div>
            <SidebarGroup
              label="Courses"
              hideActive={isDashboard}
              handleSidebarRowClick={this.handleSidebarRowClick.bind(this)} />
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
