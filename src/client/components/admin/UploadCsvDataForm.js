import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadDataset } from '../../actions/datasetActions';
import csvToJson from '../../data/csv_to_json';

class UploadCsvDataForm extends Component {
    constructor(props) {
        super(props);

        // console.log('props.userId', props.userId);

        this.state = {
            errors: {},
            userId: props.userId,
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

        var that = this;

        var f = evt.target.files[0];
        if (f) {
            var r = new FileReader();

            r.onload = function(e) {
                var contents = e.target.result;
                var jsonData = csvToJson(contents);

                that.setState({
                    isUploaded: true,
                    fileData: {
                        userId: that.state.userId,
                        ...jsonData,
                    }
                });
            }

            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    }

    onSubmit = e => {
        e.preventDefault();

        var fileData = this.state.fileData;

        this.props.uploadDataset(fileData);
    };

    render() {
        const { errors } = this.state;

        // if (this.state.fileData) {
        //     console.log("this.state.fileData", this.state.fileData.warnings);
        // }

        return (
          <div className="form-container wide">
            <div>
              <h2 className="text-center">
                Upload CSV data
              </h2>
            </div>

            <form noValidate onSubmit={this.onSubmit}>
              <input id="data-upload-input" type="file" accept="text/csv" onChange={(e) => this.parseFile(e)} />

              {this.state.isUploaded ?
              <div className="even-columns-2">

                {this.state.fileData.warnings.length > 0 ?
                <div className="data-upload-warnings">
                  {this.state.fileData.warnings.map((warning, index) => {
                    return (
                      <span key={index} className="data-upload-warning">
                        {warning}
                      </span>
                    )
                  })}
                </div>
                : ""}

                <div className="even-column">
                  <span className="data-upload-label">Preview</span>
                  <pre className="data-upload-json">
                    {JSON.stringify(this.state.fileData, null, 2)}
                  </pre>
                </div>

                <div className="even-column data-upload-metadata">
                  <div className="data-upload-metadata-fields">
                    <div className="input-field">
                      <label htmlFor="topic">Class Subject</label>
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
                      <label htmlFor="topic">Lesson Name</label>
                      <input
                        onChange={this.onChange}
                        value={this.state.fileData.lessonName}
                        id="lessonName"
                        type="text"
                        error={errors.lessonName}
                        className={classnames("", {
                          invalid: errors.lessonName
                        })}
                      />
                      <span className="input-field-error-text">{errors.lessonName}</span>
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
