import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardMenus from '../layout/DashboardMenus';
import { listDatasets, showDataset } from "../../actions/datasetActions";
import PrivateRoute from "../private-route/PrivateRoute";

import dashboardRoutes from '../../fixtures/dashboardRoutes';

class UserViz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebarSelectedCourse: localStorage.getItem("activeDataRowIndex"),
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            areDatasetsLoaded: false,
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
        return dashboardRoutes.definitions();
    }

    componentDidMount() {
        this.props.listDatasets(this.props.auth.user.id).then((response) => {
            this.setState({
                areDatasetsLoaded: true
            });
        });

        // set button selector to match URL on refresh
        // var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        // var transcriptLocationHash = localStorage.getItem("transcriptLocationHash");
        //
        // if (dashboardRoutes.paths.includes(this.props.location.pathname)) {
        //     this.props.history.push(`${buttonSelectorSelectedOption}${transcriptLocationHash}`);
        // }
        //
        // this.unlisten = this.props.history.listen((location, action) => {
        //     var buttonSelectorSelectedOption = location.pathname;
        //     var transcriptLocationHash = window.location.hash || "";
        //
        //     if (dashboardRoutes.paths.includes(buttonSelectorSelectedOption)) {
        //         this.setState({
        //             buttonSelectorSelectedOption: buttonSelectorSelectedOption.slice(1),
        //             transcriptLocationHash: transcriptLocationHash
        //         });
        //
        //         localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption.slice(1));
        //         localStorage.setItem("transcriptLocationHash", transcriptLocationHash);
        //     }
        // }).bind(this);
    }

    componentWillUnmount() {
        // this.unlisten();
    }

    render() {
        return (
          <div>
            <DashboardMenus
              sidebarSelectedCourse={this.state.sidebarSelectedCourse}
              handleSidebarRowCourseClick={this.handleSidebarRowCourseClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)} />

            <div className="dashboard-content">
                {this.dashboardRoutes().map((routeObj, index) => {
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

UserViz.propTypes = {
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
)(UserViz));
