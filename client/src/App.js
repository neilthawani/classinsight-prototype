          // var transcriptLocationHash = location.hash || "";
import React, { Component } from "react";

import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import ButtonSelector from './components/ButtonSelector';
import TalkRatio from './components/visualizations/talk-ratio/TalkRatio';
import Transcript from './components/visualizations/transcript/Transcript';
import TurnTaking from './components/visualizations/turn-taking/TurnTaking';

import Parser from './data/parser';
import data_tom from './data/data_tom';
import data_kim from './data/data_kim';

class App extends Component {
    constructor(props) {
        super(props);

        var dataRows = [data_tom[0], data_kim[0]];
        var dataParsers = dataRows.map((row) => {
            var parser = new Parser(row);
            return parser;
        });

        this.state = {
            dataParsers: dataParsers,
            selectedOption: localStorage.getItem("buttonSelectorSelectedOption"),
            activeDataRowIndex: 0
        };
    }

    activeParser = function() {
        return this.state.dataParsers[this.state.activeDataRowIndex];
    }

    // If logged in and user navigates to Register page, should redirect them to dashboard
    componentDidMount() {
        // console.log("componentDidMount");
        var buttonSelectorSelectedOption = localStorage.getItem("buttonSelectorSelectedOption");
        // console.log("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
        this.setState({
            selectedOption: buttonSelectorSelectedOption
        });

        this.props.history.push(`${buttonSelectorSelectedOption}`);
    }
    componentWillMount() {
        console.log("componentWillMount");
        // update ButtonSelector selected option on drilldown
        this.unlisten = this.props.history.listen((location, action) => {
            var buttonSelectorSelectedOption = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);

            localStorage.setItem("buttonSelectorSelectedOption", buttonSelectorSelectedOption);
            this.setState({
                selectedOption: buttonSelectorSelectedOption
            });

        }).bind(this);
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        this.unlisten();
    }

    handleButtonSelectorClick(value) {
        localStorage.setItem("buttonSelectorSelectedOption", value);
        // console.log("handleButtonSelectorClick", value);
        this.setState({
            selectedOption: value
        });
    }

    handleDataRowClick(index) {
        this.setState({
            activeDataRowIndex: index
        });
    }

    render() {
        return (
          <div className="app-container">
            <Navbar />

            {/* coarse, medium, and fine-grained visualizations */}
            <ButtonSelector
              selectedOption={this.state.selectedOption}
              handleClick={this.handleButtonSelectorClick.bind(this)} />

            <Sidebar
              dataRows={
                this.state.dataParsers.map((parser) => {
                    return parser.data;
                })
              }
              activeDataRowIndex={this.state.activeDataRowIndex}
              handleDataRowClick={this.handleDataRowClick.bind(this)}/>

            <div className="app-container-content">
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />

              {/* A <Switch> looks through all its children <Route> elements and
                renders the first one whose path matches the current URL.
                Use a <Switch> any time you have multiple routes,
                but you want only one of them to render at a time. */}
              <Switch>
                <PrivateRoute
                  exact
                  path="/dashboard"
                  component={(props) => (
                    <Dashboard {...props}
                      activeParser={this.activeParser()}
                      data={this.activeParser().data} />
                  )}
                />
                <PrivateRoute
                  exact
                  path="/talk-ratio"
                  component={(props) => (
                    <TalkRatio {...props}
                      activeParser={this.activeParser()} />
                  )}
                />
                <PrivateRoute
                  exact
                  path="/turn-taking"
                  component={(props) => (
                    <TurnTaking {...props}
                      activeParser={this.activeParser()} />
                  )}
                />
                <PrivateRoute
                  exact
                  path="/transcript"
                  component={(props) => (
                    <Transcript {...props}
                      activeParser={this.activeParser()} />
                  )}
                />
              </Switch>
            </div>
          </div>
        );
    }
}

export default withRouter(App);
