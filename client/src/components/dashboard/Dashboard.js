import React, { Component } from "react";
// import PrivateRoute from "../private-route/PrivateRoute";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ButtonSelector from '../ButtonSelector';
import VisualizationComponents from '../../fixtures/visualization_components';
import TalkRatio from '../visualizations/TalkRatio';
import Transcript from '../visualizations/Transcript';
import TurnTaking from '../visualizations/TurnTaking';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    if (!window.localStorage.getItem("buttonSelectorSelectedOption")) {
      window.localStorage.setItem("buttonSelectorSelectedOption", Object.keys(this.components)[0]);
    }

    this.state = {
      selectedOption: window.localStorage.getItem("buttonSelectorSelectedOption")
    };
  }

  components = VisualizationComponents;
  buttonSelectorOptions = Object.keys(this.components);

  handleClick(value) {
    this.setState({
      selectedOption: value
    });

    window.localStorage.setItem("buttonSelectorSelectedOption", value);
  }

  render() {
    // const { user } = this.props.auth;

    return (
      <Router>
        <div className="dashboard-container">
          <Router>
            <div className="button-selector">
              <Link to="/dashboard/talk-ratio" className="button-selector-item">Talk Ratio</Link>
              <Link to="/dashboard/transcript" className="button-selector-item">Transcript</Link>
              <Link to="/dashboard/turn-taking" className="button-selector-item">Turn Taking</Link>
            </div>
          </Router>

          {/* A <Switch> looks through all its children <Route> elements and renders the first one whose path matches the current URL. Use a <Switch> any time you have multiple routes, but you want only one of them to render at a time */}
          <Switch>
            <Route exact path="/dashboard/talk-ratio">
              <TalkRatio />
            </Route>
            <Route exact path="/dashboard/transcript">
              <Transcript />
            </Route>
            <Route exact path="/dashboard/turn-taking">
              <TurnTaking />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

Dashboard.propTypes = {
  // logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(Dashboard);

/*<ButtonSelector
  options={this.buttonSelectorOptions}
  selectedOption={this.state.selectedOption}
  onClick={this.handleClick.bind(this)} />

<div className="content-container">
  {React.createElement(this.components[this.state.selectedOption])}
</div>*/
