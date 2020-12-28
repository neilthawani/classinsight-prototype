import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { listDatasets } from "../../actions/datasetActions";

class BaseVisualization extends Component {
    constructor(props) {
        super(props);

        console.log("Base props", props);
        console.log("props.match.params.userId", props.match.params.userId);
        var adminUserId = props.match.params.userId;
        var userId = this.props.auth.user.id;

        this.state = {
            userId: adminUserId || userId
        };
    }

    componentDidMount() {
        console.log("BaseVisualization:componentDidMount");
        this.props.listDatasets(this.state.userId).then(res => {
            this.setState({
                areDatasetsLoaded: true
            });
        });
    }

    render() {
        return (
            <div className="dashboard-content"></div>
        )
    }
}

// export default BaseVisualization;


BaseVisualization.propTypes = {
    auth: PropTypes.object.isRequired,
    // showUserDetails: PropTypes.func.isRequired,
    datasets: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    // deleteDatasetById: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        datasets: state.datasets,
        admin: state.admin
    }
};

export default withRouter(connect(
    mapStateToProps,
    { listDatasets }
)(BaseVisualization));
