import React, { Component } from 'react';
import ButtonSelector from './components/ButtonSelector';

export default class App extends Component {
    buttonSelectorOptions = ['TalkRatio', 'Transcript', 'TurnTaking'];

    render() {
      return (
        <ButtonSelector options={this.buttonSelectorOptions} />
      )
    }
}
