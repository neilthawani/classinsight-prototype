import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editDataset } from "../../actions/datasetActions";
import formatDate from '../../utils/formatDate';

class UserDatasetTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areUtterancesExpanded: false
        };
    }

    deleteDataset(dataset, confirmation) {
        this.props.deleteDataset(dataset, confirmation);
    }

    expandUtterances() {
        this.setState({
            areUtterancesExpanded: !this.state.areUtterancesExpanded
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

        var parsedUtterances = JSON.stringify({
            "utterances": dataset.utterances
        }, null, 2);

        if (isDeletingDataset) {
            return (
              <tr>
                <td>{dataset.classTopic}</td>
                <td className="text-center">
                  {formatDate(dataset.classDate)}
                </td>
                <td className="text-center">
                  {dataset.classPeriod}
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
                  {dataset.classTopic}{dataset.lessonName ? `: ${dataset.lessonName}` : ''}
                </td>
                <td className="text-center">
                  {formatDate(dataset.classDate)}
                </td>
                <td className="text-center">
                  {dataset.classPeriod.join(", ")}
                </td>
                <td className="admin-table-dataset-actions">
                  <span className="btn" onClick={this.expandUtterances.bind(this)}>
                    {this.state.areUtterancesExpanded ? "Hide Utterances" : "View Utterances"}
                  </span>
                  <span className="btn" onClick={this.toggleActive.bind(this, dataset)}>
                    {dataset.isActive ? "Mark inactive" : "Mark active"}
                  </span>
                  <span className="btn" onClick={this.deleteDataset.bind(this, dataset, false)}>
                    Delete
                  </span>
                </td>
              </tr>
            , this.state.areUtterancesExpanded &&
              <tr key={`${dataset._id}-data`}>
                <td colSpan="4">
                  <pre className="admin-table-json">
                    {parsedUtterances}
                  </pre>
                </td>
              </tr>
            ]
        }
    }
}

UserDatasetTableRow.propTypes = {
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
)(withRouter(UserDatasetTableRow));
