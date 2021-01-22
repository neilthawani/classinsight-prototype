import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listDatasets, showDataset } from "../../actions/datasetActions";

import SidebarGroup from './SidebarGroup';

class Sidebar extends Component {
    handleSidebarRowClick(index) {
        this.props.handleSidebarRowClick(index);

        localStorage.setItem("activeDataRowIndex", index);

        this.props.showDataset(index);

        if (this.props.location.hash !== "") {
            this.props.history.push(this.props.location.pathname);
        }
    }

    componentDidMount() {
        if (typeof this.props.datasets.activeDataRowIndex !== "number") {
            this.handleSidebarRowClick(0);
        }

        this.props.listDatasets(this.props.auth.user.id);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        return (
          <div className="sidebar">
            {/*<div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>*/}
            {/*<div className="sidebar-data">*/}
              <SidebarGroup
                label="Courses"
                handleSidebarRowClick={this.handleSidebarRowClick.bind(this)} />
            {/*</div>*/}
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
