import React, { Component } from 'react';
import { capitalCase } from 'change-case';

export default class ButtonSelector extends Component {
    render() {
        return (
            <div className="button-selector">
              {this.props.options.map((item, index, array) => {
                  var isActive = item === this.props.selectedOption;
                  var buttonClass = 'button-selector-item';
                  if (isActive) {
                      buttonClass += ' active';
                  }

                  return <button className={buttonClass} key={index} onClick={() => this.props.onClick(item)}>
                    {capitalCase(item)}
                  </button>
              })}
            </div>
        )
    }
}
