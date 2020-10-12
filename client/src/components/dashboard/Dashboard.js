import React, { Component } from "react";
import { /*Switch,*/ withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import PrivateRoute from "../private-route/PrivateRoute";
//
// import ButtonSelector from '../ButtonSelector';
// import TalkRatio from '../visualizations/talk-ratio/TalkRatio';
// import Transcript from '../visualizations/transcript/Transcript';
// import TurnTaking from '../visualizations/turn-taking/TurnTaking';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        console.log("here", props);
        this.state = {
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption")
        };
    }

    componentDidMount() {
        console.log("this.state.buttonSelectorSelectedOption", this.state.buttonSelectorSelectedOption);
        // If logged in and user navigates to Register page, should redirect them to dashboard


        // transcriptLocationHash = this.state.transcriptLocationHash || "";
        //
        // this.props.history.push(`/dashboard/${buttonSelectorSelectedOption}${transcriptLocationHash}`);

        if (this.state.buttonSelectorSelectedOption === "dashboard") {
            this.setState({
                buttonSelectorSelectedOption: ""
            });
        }

        this.props.history.push(`${this.state.buttonSelectorSelectedOption}`);

        this.setState = ({
            buttonSelectorSelectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            transcriptLocationHash: localStorage.getItem("transcriptLocationHash") || ""
        });
    }
    componentWillMount() {
        var that = this;

        // update ButtonSelector selected option on drilldown
        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);
            var transcriptLocationHash = location.hash || "";

            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            localStorage.setItem("transcriptLocationHash", transcriptLocationHash);

            that.setState({
                buttonSelectorSelectedOption: buttonSelectorSelectedOption,
                transcriptLocationHash: transcriptLocationHash
            });
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return (
          <div className="dashboard-container">
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
