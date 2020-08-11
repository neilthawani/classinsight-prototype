import React, { Component } from 'react';
import ButtonSelector from './components/ButtonSelector';
import VisualizationComponents from './fixtures/visualization_components';

export default class App extends Component {
    constructor(props) {
        super(props);

        var handleClick = this.handleClick.bind(this);
        this.state = {
            selectedOption: Object.keys(this.components)[0]
        };
    }

    components = VisualizationComponents;
    buttonSelectorOptions = Object.keys(this.components);

    handleClick(value) {
        this.setState({
            selectedOption: value
        });
    }

    render() {
        return (
          <div className="container">
            <ButtonSelector
              options={this.buttonSelectorOptions}
              selectedOption={this.state.selectedOption}
              onClick={this.handleClick.bind(this)} />

            {React.createElement(this.components[this.state.selectedOption])}
          </div>
        )
    }
}
