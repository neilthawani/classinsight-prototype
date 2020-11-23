import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class UserDetailsPage extends Component {
    constructor(props) {
        // debugger;
    }

    // componentWillRender

    render() {
        return (
          <div></div>
        )
    }
}

UserDetailsPage.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(
  mapStateToProps,
  {}
)(UserDetailsPage);
