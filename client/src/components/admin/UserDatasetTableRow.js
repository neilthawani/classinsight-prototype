import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
// import { editDataset } from "../../actions/datasetActions";
// import UserTypes from '../../fixtures/user_types';
// import UserDetailsPage from './UserDetailsPage';
import formatDate from '../../utils/formatDate';

class AdminPanelTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isJsonDataExpanded: false,
            // isEditingDataset: false,
            // errors: {},
            // name: props.user.name,
            // email: props.user.email,
            // userType: props.user.userType
        };
    }

    // static getDerivedStateFromProps(nextProps, state) {
    //     var hasErrors = Object.keys(nextProps.errors).length > 0;
    //
    //     if (hasErrors && state.email !== nextProps.user.email) {
    //         return ({
    //             errors: nextProps.errors,
    //             isEditingUser: true
    //         });
    //     }
    //
    //     return null;
    // }

    // userTypeAsWords(type) {
    //     return UserTypes.filter(obj => obj.value === type)[0] &&
    //             UserTypes.filter(obj => obj.value === type)[0].label;
    // }

    // onChange = e => {
    //     this.setState({ [e.target.id]: e.target.value });
    // }

    // toggleEditingUser(user) {
    //     this.setState({
    //         isEditingUser: user ? user : false
    //     });
    // }

    deleteDataset(dataset, confirmation) {
        this.props.deleteDataset(dataset, confirmation);
    }

    expandJsonData() {
        this.setState({
            isJsonDataExpanded: !this.state.isJsonDataExpanded
        });
    }

    // editUser(id) {
    //     var user = {
    //         _id: id,
    //         name: this.state.name,
    //         email: this.state.email,
    //         userType: parseInt(this.state.userType, 10)
    //     }
    //
    //     this.props.editUser({ user: user });
    //
    //     this.toggleEditingUser();
    // }

    // goToUserDetailsPage(id) {
    //     debugger;
    // }

    render() {
        var { isDeletingDataset, dataset } = this.props;
        // var { name, email, userType } = this.state;
        // const { errors } = this.state;
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
                {/*<td>
                  <pre className="admin-table-json">
                    {parsedJson}
                  </pre>
                </td>*/}
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
                {/*<td>
                  <pre className="admin-table-json">
                    {parsedJson}
                  </pre>
                </td>*/}
                <td className="admin-table-actions">
                  <span className="btn" onClick={this.expandJsonData.bind(this)}>
                    {this.state.isJsonDataExpanded ? "Hide Data" : "View Data"}
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
    // editUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
  mapStateToProps,
  { }
)(withRouter(AdminPanelTableRow));
