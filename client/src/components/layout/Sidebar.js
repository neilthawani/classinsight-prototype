import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';
import formatDate from '../../utils/formatDate';

import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Sidebar extends Component {
    handleSidebarRowClick(index) {
        this.props.handleSidebarRowClick(index);
    }

    componentDidMount() {
        console.log("sidebar props", this.props);
    }

    render() {
        return (
          <div className="sidebar">
            <div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>
            <div className="sidebar-data">
              {this.props.dataRows.map((item, index, array) => {
                  var datum = item.data;

                  return (
                    <div key={index}
                      className={this.props.activeDataRowIndex === index ? "sidebar-data-row active" : "sidebar-data-row"}
                      onClick={this.handleSidebarRowClick.bind(this, index)}>
                      <div className="sidebar-data-row-title">
                        {datum.metadata.topic}
                      </div>

                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Date:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {formatDate(datum.metadata.date)}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Period:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {datum.metadata.period}
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
    // auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    // admin: PropTypes.object.isRequired,
    // deleteDatasetById: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        // auth: state.auth,
        datasets: state.datasets,

    }
};

export default connect(
  mapStateToProps,
  { }
)(withRouter(Sidebar));
