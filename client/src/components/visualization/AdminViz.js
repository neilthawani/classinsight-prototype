import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardMenus from '../layout/DashboardMenus';
import { listDatasets, showDataset } from "../../actions/datasetActions";
import PrivateRoute from "../private-route/PrivateRoute";

import dashboardRoutes from '../../fixtures/dashboardRoutes';

class AdminViz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebarSelectedCourse: localStorage.getItem("activeDataRowIndex"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            areDatasetsLoaded: false,
            admin: {
                userId: props.match.params.userId
            }
        };
    }

    handleSidebarRowCourseClick(value) {
        this.props.showDataset(value);

        localStorage.setItem("activeDataRowIndex", value);

        this.setState({
            sidebarSelectedCourse: value
        });
    }

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);

        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    dashboardRoutes(admin) {
        return dashboardRoutes.definitions(this.state.admin);
    }

    componentDidMount() {
        this.props.listDatasets(this.state.admin.userId).then((response) => {
            this.setState({
                areDatasetsLoaded: true
            });
        });
    }

    render() {
        // Note 1/31/21: Leave this here for now in case something breaks.
        // var areDatasetsLoaded = Object.keys(this.props.datasets).length > 0;
        //
        // if (!areDatasetsLoaded) {
        //     return null;
        // }

        return (
          <div>
            <DashboardMenus
              admin={this.state.admin}
              sidebarSelectedCourse={this.state.sidebarSelectedCourse}
              handleSidebarRowCourseClick={this.handleSidebarRowCourseClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)}
              datasets={this.props.datasets} />

            <div className="dashboard-content">
                {this.dashboardRoutes(this.state.admin).map((routeObj, index) => {
                    return (
                        <PrivateRoute
                          exact
                          key={index}
                          path={routeObj.path}
                          component={routeObj.component}
                        />
                    )
                })}
            </div>
          </div>
        );
    }
}

AdminViz.propTypes = {
    admin: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    listDatasets: PropTypes.func.isRequired,
    showDataset: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        admin: state.admin,
        auth: state.auth,
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { listDatasets, showDataset }
)(AdminViz));
