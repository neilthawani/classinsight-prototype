import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { listDatasets, showDataset } from "../../actions/datasetActions";

import calculateLessonDuration from '../../utils/calculateLessonDuration';
import formatDate from '../../utils/formatDate';

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
            <div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>
            <div className="sidebar-data">
              {this.props.datasets.dataParsers.map((item, index, array) => {
                  var datum = item.data;
                  var topic = item.topic,
                      date = formatDate(item.date),
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
                          {period.length > 1 ? "Periods:" : "Period:"}
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {period.join(", ")}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Duration:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {calculateLessonDuration(datum.duration)}
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
