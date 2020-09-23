import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class HoverBox extends Component {
    constructor(props) {
        console.log("props", props);
        super(props);
        this.state = {
            width: props.width,
            height: props.height,
            display: props.activeLabel === props.label ? "block" : "none"
        };
    }

    handleClick(value) {
        this.props.handleClick(value);
    }

    styles() {
        return {
            width: `${this.state.width}px`,
            height: `${this.state.height}px`,
            display: this.state.display
        };
    }

    render() {

      return (
        <div className="hover-box" style={this.styles()}>
          <div className="hover-box-title">
          </div>
          <div className="hover-box-text">
            {this.props.label.description}
          </div>
        </div>
      );
    }
}

HoverBox.propTypes = {
    label: PropTypes.object.isRequired,
    activeLabel: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};
