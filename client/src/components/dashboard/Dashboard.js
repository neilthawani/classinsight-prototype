import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import ButtonSelector from '../ButtonSelector';
// import VisualizationComponents from '../../fixtures/visualization_components';
import TalkRatio from '../visualizations/TalkRatio';
import Transcript from '../visualizations/Transcript';
import TurnTaking from '../visualizations/TurnTaking';

class Dashboard extends Component {
  // constructor(props) {
  //   super(props);
  //
  //   if (!window.localStorage.getItem("buttonSelectorSelectedOption")) {
  //     window.localStorage.setItem("buttonSelectorSelectedOption", Object.keys(this.components)[0]);
  //   }
  //
  //   this.state = {
  //     selectedOption: window.localStorage.getItem("buttonSelectorSelectedOption")
  //   };
  // }

  // components = VisualizationComponents;
  // buttonSelectorOptions = Object.keys(this.components);

  // handleClick(value) {
  //   console.log("value", value);
  //   // debugger;
  //   this.setState({
  //     selectedOption: value
  //   });
  //
  //   window.localStorage.setItem("buttonSelectorSelectedOption", value);
  // }
  // componentDidMount() {
  //   // If logged in and user navigates to Register page, should redirect them to dashboard
  //   // debugger;
  //   this.props.history.push(`/dashboard/${this.state.selectedOption}`);
  // }

  render() {
    return (
      <Router>
        <div>
          <div className="button-selector">
            <Link className="button-selector-item" to="/dashboard/transcript">Transcript</Link>
            <Link className="button-selector-item" to="/dashboard/talk-ratio">Talk Ratio</Link>
            {/*onClick={this.handleClick.bind(this, "talk-ratio")}*/}
            <Link className="button-selector-item" to="/dashboard/turn-taking">Turn Taking</Link>
          </div>

          {/* A <Switch> looks through all its children <Route> elements and renders the first one whose path matches the current URL. Use a <Switch> any time you have multiple routes, but you want only one of them to render at a time. */}
          <Switch>
            <Route exact path="/dashboard/transcript">
              <Transcript />
            </Route>
            <Route path="/dashboard/talk-ratio">
              <TalkRatio />
            </Route>
            <Route path="/dashboard/turn-taking">
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
