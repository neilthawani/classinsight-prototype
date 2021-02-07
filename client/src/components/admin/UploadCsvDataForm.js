import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadDataset } from '../../actions/datasetActions';
import { readString } from 'react-papaparse';

class UploadCsvDataForm extends Component {
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
        evt.preventDefault();

        var userId = this.state.userId;
        var jsonData = {};
        var props = this.props;

        var f = evt.target.files[0];
        if (f) {
            var r = new FileReader();

            r.onload = function(e) {
                debugger;

                var contents = e.target.result;
                var parsedCsv = readString(contents);
                console.log("parsedCsv", parsedCsv);
                var lines = parsedCsv.data;
                var metadataHeaders = lines[0];
                var metadata = lines[1];
                var metaContents = metadataHeaders.reduce((prev, item, index, array) => {
                    var key = metadataHeaders[index]
                    var value = metadata[index];

                    if (value) {
                        prev[key] = value;
                    }

                    return prev;
                }, {});


                console.log("metaContents", metaContents);

                var data = {
                    segments: [{
                        speaking_turns: []
                    }]
                };
                var headers = lines[2];
                console.log("headers", headers);
                var lineData = lines.splice(3);
                console.log("lineData", lineData);

                var dataRows = lineData.map((lineDatum, index, array) => {
                    var dataRow = {};
                    lineDatum.forEach((value, jindex, jarray) => {
                        var key = headers[jindex];

                        if (value) {
                            dataRow[key] = value;
                        }
                    });

                    return dataRow;
                });

                console.log("dataRows", dataRows);
                data.segments[0].speaking_turns = dataRows;

                jsonData = {
                    ...metaContents,
                    ...data
                };

                console.log("jsonData", jsonData);
            }

            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }

        // console.log("jsonData", jsonData);
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
                Upload CSV data
              </h2>
            </div>

            <form noValidate onSubmit={this.onSubmit}>
              <input id="data-upload-input" type="file" accept="text/csv" onChange={(e) => this.parseFile(e)} />

              {/*{this.state.isUploaded ?
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
              : ""}*/}
            </form>
          </div>
        )
    }
}

UploadCsvDataForm.propTypes = {
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
)(withRouter(UploadCsvDataForm));
