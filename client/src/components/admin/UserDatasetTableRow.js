import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editDataset } from "../../actions/datasetActions";
import formatDate from '../../utils/formatDate';

class AdminPanelTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isJsonDataExpanded: false
        };
    }

    deleteDataset(dataset, confirmation) {
        this.props.deleteDataset(dataset, confirmation);
    }

    expandJsonData() {
        this.setState({
            isJsonDataExpanded: !this.state.isJsonDataExpanded
        });
    }

    toggleActive(dataset) {
        var newDataset = {
            ...dataset,
            isActive: !dataset.isActive
        }

        this.props.editDataset({dataset: newDataset});
        this.setState({dataset: newDataset});
    }

    render() {
        var { isDeletingDataset, dataset } = this.props;

        var parsedJson = JSON.stringify(JSON.parse(dataset.jsonData), null, 2);

        if (isDeletingDataset) {
            return (
              <tr>
                <td>{dataset.class_topic}</td>
                <td className="text-center">
                  {formatDate(dataset.class_date)}
                </td>
                <td className="text-center">
                  {dataset.class_period}
                </td>
                <td className="admin-table-actions-confirm">
                  <span className="admin-table-actions-confirm-text">
                    Are you sure?
                  </span>
                  <div className="admin-table-actions-confirm-buttons">
                    <span className="btn" onClick={this.deleteDataset.bind(this, dataset, true)}>
                      Yes, delete
                    </span>
                    <span className="btn" onClick={this.deleteDataset.bind(this, dataset, false)}>
                      No, cancel
                    </span>
                  </div>
                </td>
              </tr>
            )
        } else {
            return [
              <tr key={dataset._id}>
                <td>
                  {dataset.class_topic}
                </td>
                <td className="text-center">
                  {formatDate(dataset.class_date)}
                </td>
                <td className="text-center">
                  {dataset.class_period}
                </td>
                <td className="admin-table-dataset-actions">
                  <span className="btn" onClick={this.expandJsonData.bind(this)}>
                    {this.state.isJsonDataExpanded ? "Hide Data" : "View Raw JSON"}
                  </span>
                  <span className="btn" onClick={this.toggleActive.bind(this, dataset)}>
                    {dataset.isActive ? "Mark inactive" : "Mark active"}
                  </span>
                  <span className="btn" onClick={this.deleteDataset.bind(this, dataset, false)}>
                    Delete
                  </span>
                </td>
              </tr>
            , this.state.isJsonDataExpanded &&
              <tr key={`${dataset._id}-data`}>
                <td colSpan="4">
                  <pre className="admin-table-json">
                    {parsedJson}
                  </pre>
                </td>
              </tr>
            ]
        }
    }
}

AdminPanelTableRow.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    editDataset: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
  mapStateToProps,
  { editDataset }
)(withRouter(AdminPanelTableRow));
