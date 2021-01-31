import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import PropTypes from "prop-types";
// import DashboardMenus from '../layout/DashboardMenus';
// import { listDatasets } from "../../actions/datasetActions";
// import PrivateRoute from "../private-route/PrivateRoute";
// import { Switch } from "react-router-dom";

// import Dashboard from "../dashboard/Dashboard";
// import TalkRatio from '../visualization/talk-ratio/TalkRatio';
// import Transcript from '../visualization/transcript/Transcript';
// import TurnTaking from '../visualization/turn-taking/TurnTaking';

export default class DatasetPreview extends Component {
    // constructor(props) {
    //     super(props);

        // var userId = props.match.params.userId;
        // console.log("userId", userId);
        // this.state = {
            // sidebarSelectedOption: 0,
            // buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption") || "dashboard",
            // userId: userId,
            // areUserDatasetsLoaded: false,
            // datasets: props.datasets
        // };
    // }

    // componentDidMount() {
    //     this.props.listDatasets(this.state.userId);
    // }

    // handleSidebarRowClick(value) {
    //     localStorage.setItem("sidebarSelectedOption", value);
    //
    //     this.setState({
    //         sidebarSelectedOption: value
    //     });
    // }

    // handleButtonSelectorClick(value) {
    //     localStorage.setItem("buttonSelectorSelectedOption", value);
    //
    //     this.setState({
    //         buttonSelectorSelectedOption: value
    //     });
    // }

    render() {
        // var areDatasetsLoaded = Object.keys(this.props.datasets).length > 0;
        //
        // if (!areDatasetsLoaded) {
        //     return null;
        // }

        return (
          <div>
            {/*<DashboardMenus
              admin={{ userId: this.state.userId }}
              datasets={this.props.datasets}
              sidebarSelectedOption={this.state.sidebarSelectedOption}
              handleSidebarRowClick={this.handleSidebarRowClick.bind(this)}
              buttonSelectorSelectedOption={this.state.buttonSelectorSelectedOption}
              handleButtonSelectorClick={this.handleButtonSelectorClick.bind(this)} />*/}

            <div className="dashboard-content">
              {/* A <Switch> looks through all its children <Route> elements and
                renders the first one whose path matches the current URL.
                Use a <Switch> any time you have multiple routes,
                but you want only one of them to render at a time. */}
              {/*<Switch>
                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/dashboard'
                  component={(props) => ( <Dashboard {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/talk-ratio'
                  component={(props) => ( <TalkRatio {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/turn-taking'
                  component={(props) => ( <TurnTaking {...props} /> )}
                />

                <PrivateRoute
                  exact
                  path='/admin/user/:userId/preview/transcript'
                  component={(props) => ( <Transcript {...props} /> )}
                />
              </Switch>*/}
            </div>
          </div>
        )
    }
}

// DatasetPreview.propTypes = {
//     datasets: PropTypes.object.isRequired,
//     admin: PropTypes.object.isRequired,
//     listDatasets: PropTypes.func.isRequired
// }

// function mapStateToProps(state) {
//     return {
//         auth: state.auth,
//         datasets: state.datasets,
//         admin: state.admin
//     }
// };
//
// export default withRouter(connect(
//     mapStateToProps,
//     { listDatasets }
// )(DatasetPreview));
