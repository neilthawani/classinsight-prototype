import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { showDataset } from "../../actions/datasetActions";

class Sidebar extends Component {
    handleSidebarRowClick(index) {
        this.props.handleSidebarRowClick(index);

        localStorage.setItem("activeDataRowIndex", index);
        console.log("this.props", this.props);
        this.props.showDataset(index);

        if (this.props.location.hash !== "") {
            this.props.history.push(this.props.location.pathname);
        }
    }

    toggleUploadDataForm() {
        this.props.toggleUploadDataForm();
    }

    componentDidMount() {
        if (typeof this.props.datasets.activeDataRowIndex !== "number") {
            this.handleSidebarRowClick(0);
        }
    }

    render() {
        return (
          <div className="sidebar">
            <div className="sidebar-header">
              <Icon
                path={mdiDatabase}
                className="sidebar-header-icon"
                size={2}
                onClick={this.toggleUploadDataForm.bind(this)} />
            </div>
            <div className="sidebar-data">
              {(this.props.datasets.dataParsers || []).map((item, index, array) => {
                  var datum = item.data;
                  var topic = item.topic,
                      date = item.date,
                      period = item.period;

                  return (
                    <div key={index}
                      className={this.props.datasets.activeDataRowIndex === index ? "sidebar-data-row active" : "sidebar-data-row"}
                      onClick={this.handleSidebarRowClick.bind(this, index)}>
                      <div className="sidebar-data-row-title">
                        {topic}
                      </div>

                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Date:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {date}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Period:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {period}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Duration:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {new Date(datum.duration * 1000).toISOString().substr(11, 8)}
                        </span>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        );
    }
}

Sidebar.propTypes = {
    datasets: PropTypes.object.isRequired,
    showDataset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        datasets: state.datasets,

    }
};

export default withRouter(connect(
  mapStateToProps,
  { showDataset }
)(Sidebar));
