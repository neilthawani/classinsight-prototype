import React, { Component } from "react";
import { Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PrivateRoute from "../private-route/PrivateRoute";

import ButtonSelector from '../ButtonSelector';
import TalkRatio from '../visualizations/talk-ratio/TalkRatio';
import Transcript from '../visualizations/transcript/Transcript';
import TurnTaking from '../visualizations/turn-taking/TurnTaking';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }
    componentWillMount() {
        // update ButtonSelector selected option on drilldown
        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
            var transcriptLocationHash = location.hash || "";
            // debugger;
            // console.log("location", location);
            console.log("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            console.log("transcriptLocationHash", transcriptLocationHash);

            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            localStorage.setItem("transcriptLocationHash", transcriptLocationHash)
            this.setState({
                buttonSelectorSelectedOption: buttonSelectorSelectedOption,
                transcriptLocationHash: transcriptLocationHash
            });
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        this.props.history.push(`/dashboard/${this.state.buttonSelectorSelectedOption}${this.state.transcriptLocationHash}`);
    }

    handleClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);
        this.setState({
            buttonSelectorSelectedOption: value
        });
    }

    render() {
        // A <Switch> looks through all its children <Route> elements and
        //   renders the first one whose path matches the current URL.
        //   Use a <Switch> any time you have multiple routes,
        //   but you want only one of them to render at a time.

        // <PrivateRoute exact path="/dashboard" component={Dashboard} />
        return (
          <div className="dashboard-container">
            {/* coarse, medium, and fine-grained visualizations */}
            <ButtonSelector
              selectedOption={this.state.buttonSelectorSelectedOption}
              handleClick={this.handleClick.bind(this)} />

            <Switch>
              <PrivateRoute exact path="/dashboard/talk-ratio" component={TalkRatio} />
              <PrivateRoute exact path="/dashboard/turn-taking" component={TurnTaking} />
              <PrivateRoute exact path="/dashboard/transcript" component={Transcript} />
            </Switch>
          </div>
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
