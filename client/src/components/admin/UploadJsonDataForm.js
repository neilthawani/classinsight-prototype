import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadDataset } from '../../actions/datasetActions';

class UploadJsonDataForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            userId: props.userId,
            classTopic: "",
            isUploaded: false,
            isValid: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (Object.keys(nextProps.errors).length > 0) {
            return ({
                errors: nextProps.errors
            });
        }

        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.datasets.isValid) {
            this.dismountForm();
        }

        return true;
    }

    dismountForm() {
        this.props.dismountForm();
    }

    onChange = e => {
        this.setState({
            fileData: {
                ...this.state.fileData,
                [e.target.id]: e.target.value
            }
        });
    }

    parseFile = async (evt) => {
        var userId = this.state.userId;
        evt.preventDefault();
        const reader = new FileReader();

        try {
            reader.readAsText(evt.target.files[0]);
        } catch(e) {
            console.error(e);
            this.setState({
                isUploaded: false,
                fileData: {}
            });
        }

        reader.onload = async (e) => {
            const text = e.target.result;
            var jsonData = JSON.parse(text);

            var el = document.getElementById("data-upload-input");
            var fileName = el.value.split("\\")[2];

            var fileMetadata = fileName.split("_");
            var classDate = fileMetadata[1],
                classDate = classDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            var classPeriod = fileMetadata[2].replace("Per", "").replace(".json", "").replace("_", ", ");

            this.setState({
                isUploaded: true,
                fileData: {
                    userId: userId,
                    filename: fileName,
                    classTopic: "",
                    classDate: classDate,
                    classPeriod: classPeriod,
                    jsonData: jsonData
                }
            })
        };
    }

    onSubmit = e => {
        e.preventDefault();

        var fileData = this.state.fileData;

        this.props.uploadDataset(fileData);
    };

    render() {
        const { errors } = this.state;

        return (
          <div className="form-container wide">
            <div>
              <h2 className="text-center">
                Upload data
              </h2>
              <h3 className="text-center">
                If this data is from 2019 and does not use the new coding scheme, <br />please upload your raw file to the CSV uploader instead.
              </h3>
            </div>

            <form noValidate onSubmit={this.onSubmit}>
              <input id="data-upload-input" type="file" accept="application/JSON" onChange={(e) => this.parseFile(e)} />

              {this.state.isUploaded ?
              <div className="even-columns-2">
                <div className="even-column">
                  <span className="data-upload-label">Preview</span>
                  <pre className="data-upload-json">
                    {JSON.stringify(this.state.fileData.jsonData, null, 2)}
                  </pre>
                </div>

                <div className="even-column data-upload-metadata">
                  <div className="data-upload-metadata-fields">
                    <div className="input-field">
                      <label htmlFor="topic">Class Topic</label>
                      <input
                        onChange={this.onChange}
                        value={this.state.fileData.classTopic}
                        id="classTopic"
                        type="text"
                        error={errors.classTopic}
                        className={classnames("", {
                          invalid: errors.classTopic
                        })}
                      />
                      <span className="input-field-error-text">{errors.classTopic}</span>
                    </div>

                    <div className="input-field">
                      <label htmlFor="date">Date</label>
                      <input
                        onChange={this.onChange}
                        value={this.state.fileData.classDate}
                        id="classDate"
                        type="date"
                      />
                    </div>

                    <div className="input-field">
                      <label htmlFor="period">Period(s), comma-separated</label>
                      <input
                        onChange={this.onChange}
                        value={this.state.fileData.classPeriod}
                        id="classPeriod"
                        type="text"
                        error={errors.classPeriod}
                        className={classnames("", {
                          invalid: errors.classPeriod
                        })}
                      />
                      <span className="input-field-error-text">{errors.classPeriod}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-submit">
                    Upload
                  </button>
                </div>
              </div>
              : ""}
            </form>
          </div>
        )
    }
}

UploadJsonDataForm.propTypes = {
    uploadDataset: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
        errors: state.errors,
        datasets: state.datasets,
        admin: state.admin
    }
};

export default connect(
  mapStateToProps,
  { uploadDataset }
)(withRouter(UploadJsonDataForm));
