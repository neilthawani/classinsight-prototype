import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ButtonSelector from './components/ButtonSelector';
import VisualizationComponents from './fixtures/visualization_components';

export default class App extends Component {
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
        return (
          <div className="container">
            <Router>
              <Navbar />
              
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Router>

            <ButtonSelector
              options={this.buttonSelectorOptions}
              selectedOption={this.state.selectedOption}
              onClick={this.handleClick.bind(this)} />

            <div className="visualization">
              {React.createElement(this.components[this.state.selectedOption])}
            </div>
          </div>
        )
    }
}
