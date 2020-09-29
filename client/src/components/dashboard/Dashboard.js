import React, { Component } from "react";
import { Switch } from "react-router-dom";

import PrivateRoute from "../private-route/PrivateRoute";
import TalkRatio from '../visualizations/talk-ratio/TalkRatio';
import Transcript from '../visualizations/transcript/Transcript';
import TurnTaking from '../visualizations/turn-taking/TurnTaking';

import PropTypes from "prop-types";
import { connect } from "react-redux";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        console.log("Dashboard props", props);

        this.state = {
            selectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        this.props.history.push(`/dashboard/${this.state.selectedOption}`);
        console.log("here");
    }

    render() {
        {/* A <Switch> looks through all its children <Route> elements and
          renders the first one whose path matches the current URL.
          Use a <Switch> any time you have multiple routes,
          but you want only one of them to render at a time. */}
        return (
          <Switch>
            <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} />
            <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} />
            <PrivateRoute exact path="/dashboard/transcript" component={Transcript} />
          </Switch>
        );
    }
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(Dashboard);
