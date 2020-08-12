import React, { Component } from 'react';
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
