import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { uploadDataset } from '../../actions/datasetActions';

class UploadDataForm extends Component {
    constructor(props) {
        super(props);
        // console.log("props", props);
        this.state = {
            errors: {},
            userId: props.userId,
            class_topic: "",
            isUploaded: false,
            isValid: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("nextProps", nextProps, "prevState", prevState);

        if (Object.keys(nextProps.errors).length > 0) {
            return ({
                errors: nextProps.errors
            });
        }

        // console.log("nextProps", nextProps, "prevState", prevState);

        if (Object.keys(nextProps.datasets).length > 0) {
            console.log("heh");
            this.appendDataset(nextProps.datasets);
        }

        return null;
    }

    appendDataset(dataset) {
        this.props.appendDataset(dataset);
    }

    onChange = e => {
        // console.log("e.target.value", e.target.value);
        // console.log("e.target.id", e.target.id);
        // var id = [e.target.id];
        this.setState({
            fileData: {
                ...this.state.fileData,
                [e.target.id]: e.target.value
            }
        });
    }
    //
    // onSubmit = e => {
    //     e.preventDefault();
    //
    //     const newUser = {
    //         filename: this.state.filename,
    //         topic: this.state.name,
    //         date: this.state.email,
    //         period: this.state.userType,
    //         jsonData: this.state.jsonData
    //     };
    //
    //     this.props.createUser(newUser);
    // };
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
            // console.log("e.target", e.target, "e", e);
            const text = e.target.result;
            // console.log("filename", e.target.fileName);
            // console.log(text)
            var jsonData = JSON.parse(text);
            // console.log("jsonData", jsonData);
            // alert(text)
            // console.loge.target.files[0]
            var el = document.getElementById("data-upload-input");
            var fileName = el.value.split("\\")[2];
            // console.log("fileName", fileName);

            var fileMetadata = fileName.split("_");
            var class_date = fileMetadata[1],
                classDate = class_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            var class_period = fileMetadata[2].replace("Per", "").replace(".json", "").replace("_", ", ");
            // console.log("classPeriod", class_period);

            this.setState({
                isUploaded: true,
                fileData: {
                    user_id: userId,
                    filename: fileName,
                    class_topic: "",
                    class_date: classDate,
                    class_period: class_period,
                    jsonData: jsonData
                }
            })
        };

        // reader.onloadend = (file) => {
        //     console.log("e onloaded", file.target.fileName);
        // }


        // console.log("evt", evt);
        // debugger;
    }
    // https://www.baeldung.com/mongodb-bson
    onSubmit = e => {
        e.preventDefault();
        // console.log("here");
        // debugger;
        var fileData = this.state.fileData;
        fileData['jsonData'] = JSON.stringify(this.state.fileData.jsonData);
        //     ...this.state.fileData
        // };

        // console.log("fileData", fileData);
        // console.log("type of jsonData", typeof fileData.jsonData);

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
                        value={this.state.fileData.class_topic}
                        id="class_topic"
                        type="text"
                        error={errors.class_topic}
                        className={classnames("", {
                          invalid: errors.class_topic
                        })}
                      />
                      <span className="input-field-error-text">{errors.class_topic}</span>
                    </div>

                    <div className="input-field">
                      <label htmlFor="date">Date</label>
                      <input
                        onChange={this.onChange}
                        value={this.state.fileData.class_date}
                        id="class_date"
                        type="date"
                      />
                    </div>

                    <div className="input-field">
                      <label htmlFor="period">Period(s), comma-separated</label>
                      <input
                        onChange={this.onChange}
                        value={this.state.fileData.class_period}
                        id="class_period"
                        type="text"
                        error={errors.class_period}
                        className={classnames("", {
                          invalid: errors.class_period
                        })}
                      />
                      <span className="input-field-error-text">{errors.class_period}</span>
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

UploadDataForm.propTypes = {
    uploadDataset: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired
    // admin: PropTypes.object.isRequired
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
)(withRouter(UploadDataForm));
