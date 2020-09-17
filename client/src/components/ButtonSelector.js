import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class ButtonSelector extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(value) {
        console.log("ButtonSelector value", value);
        this.props.handleClick(value);
    }

    render() {
        return (
          <div className="button-selector">
            <Link
              className={this.props.selectedOption === "talk-ratio" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="talk-ratio"
              to="/dashboard/talk-ratio"
              onClick={this.handleClick.bind(this, "talk-ratio")}>
              Talk Ratio
            </Link>

            <Link
              className={this.props.selectedOption === "turn-taking" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="turn-taking"
              to="/dashboard/turn-taking"
              onClick={this.handleClick.bind(this, "turn-taking")}>
              Turn Taking
            </Link>

            <Link
              className={this.props.selectedOption === "transcript" ? "button-selector-item active" : "button-selector-item"}
              data-attr-name="transcript"
              to="/dashboard/transcript"
              onClick={this.handleClick.bind(this, "transcript")}>
              Transcript
            </Link>
          </div>
        );
    }
}
