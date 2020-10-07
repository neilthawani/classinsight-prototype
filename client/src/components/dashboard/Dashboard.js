import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Dashboard extends Component {
    render() {
        // A <Switch> looks through all its children <Route> elements and
        //   renders the first one whose path matches the current URL.
        //   Use a <Switch> any time you have multiple routes,
        //   but you want only one of them to render at a time.

        // <PrivateRoute exact path="/dashboard" component={Dashboard} />
        return (
          <div className="dashboard-container">
          </div>
        );
    }
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(withRouter(Dashboard));
