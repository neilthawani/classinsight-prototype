import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';
// import formatDate from '../../utils/formatDate';

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { showDataset } from "../../actions/datasetActions";

class Sidebar extends Component {
    // constructor(props) {
    //     super(props)

        // console.log("Sidebar constructor", props);

        // this.state = {
        //     activeDataRowIndex: parseInt(localStorage.getItem("activeDataRowIndex"), 10) || 0
        // };

        // console.log("Sidebar activeDataRowIndex", this.state.activeDataRowIndex, typeof this.state.activeDataRowIndex);
    // }

    handleSidebarRowClick(index) {
        // console.log("handleSidebarRowClick", index);
        // NEXT TODO:
        // this.props.setActiveSidebarIndex(index);
        this.props.handleSidebarRowClick(index);
        // this.setState({
        //     activeDataRowIndex: index
        // });

        localStorage.setItem("activeDataRowIndex", index);

        // console.log("Sidebar handleSidebarRowClick", this.props);

        this.props.showDataset(index);

        if (this.props.location.hash !== "") {
            this.props.history.push(this.props.location.pathname);
        }
    }

    componentDidMount() {
        // console.log("sidebar props", this.props.datasets.activeDataRowIndex);
        if (typeof this.props.datasets.activeDataRowIndex !== "number") {
            this.handleSidebarRowClick(0);
        }
    }

    render() {
        // console.log("this.props.datasets.dataParsers")
        return (
          <div className="sidebar">
            <div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>
            <div className="sidebar-data">
              {(this.props.datasets.dataParsers || []).map((item, index, array) => {
                  var datum = item.data;
                  // console.log("item", item);
                  // console.log("datum", datum);
                  // if (datum === undefined) {
                  //     return null;
                  // }
                  // console.log("datum", datum);
                  // var metadata = datum.metadata || {};
                  // console.log("metadata", metadata);
                  // Note: Remove this "metadata" after app goes to prod, except for testing.
                  var topic = item.topic,
                      date = item.date,//formatDate(item && item.class_date),
                      period = item.period;//item && item.class_period;
                  // debugger;

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
    // auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    // admin: PropTypes.object.isRequired,
    showDataset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        // auth: state.auth,
        datasets: state.datasets,

    }
};

export default withRouter(connect(
  mapStateToProps,
  { showDataset }
)(Sidebar));
