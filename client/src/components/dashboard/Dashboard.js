import React, { Component } from "react";
import { Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PrivateRoute from "../private-route/PrivateRoute";
import TalkRatio from '../visualizations/talk-ratio/TalkRatio';
import Transcript from '../visualizations/transcript/Transcript';
import TurnTaking from '../visualizations/turn-taking/TurnTaking';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            console.log("Dashboard", "this.state", this.state, "this.props", this.props);
            console.log("Dashboard", location, action);

            // debugger;

            localStorage.setItem("buttonSelectorSelectedOption", "transcript");
            this.setState({buttonSelectorSelectedOption: "transcript"});
            console.log("on route change");
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    componentDidMount() {
        console.log("Dashboard componentDidMount");
        // If logged in and user navigates to Register page, should redirect them to dashboard
        this.props.history.push(`/dashboard/${this.state.selectedOption}`);
    }

    render() {
        // A <Switch> looks through all its children <Route> elements and
        //   renders the first one whose path matches the current URL.
        //   Use a <Switch> any time you have multiple routes,
        //   but you want only one of them to render at a time.

        // <PrivateRoute exact path="/dashboard" component={Dashboard} />
        return (
          <Switch>
            <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} state={{button: "button1"}} />
            <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} state={{button: "button2"}} />
            <PrivateRoute exact path="/dashboard/transcript" component={Transcript} state={{button: "button3"}} />
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
)(withRouter(Dashboard));
