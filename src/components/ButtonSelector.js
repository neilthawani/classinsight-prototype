import React, { Component } from 'react';
import { capitalCase } from 'change-case';

export default class ButtonSelector extends Component {
  render() {
    return (
      <div className="button-selector">
        {this.props.options.map((item, index, array) => {
            return <button className="button-selector-item" key={index}>
              {capitalCase(item)}
            </button>
        })}
      </div>
    )
  }
}
