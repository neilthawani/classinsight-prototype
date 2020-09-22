import React, { Component } from 'react';
import PropTypes from "prop-types";

export default class HoverBox extends Component {
    constructor(props) {
        console.log("props", props);
        super(props);
        this.state = {
            width: 300,
            height: 200,
            backgroundColor: "white",
            border: "1px solid #cecece",
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
            backgroundColor: this.state.backgroundColor,
            border: this.state.border,
            display: this.state.display
        };
    }

    render() {

      return (
        <div className="hover-box" style={this.styles()}>
        </div>
      );
    }
}

HoverBox.propTypes = {
    // label: PropTypes.object.isRequired,
    // displayRatio: PropTypes.bool,
    // handleClick: PropTypes.func.isRequired
};
