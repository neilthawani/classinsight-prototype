import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.errors) {
    //         return ({
    //             errors: nextProps.errors
    //         });
    //     }
    //
    //     return null;
    // }

    onChange = e => {
        console.log("e.target.value", e.target.value);
        this.setState({ [e.target.id]: e.target.value });
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
        evt.preventDefault()
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
            console.log("jsonData", jsonData);
            // alert(text)
            // console.loge.target.files[0]
            var el = document.getElementById("data-upload-input");
            var fileName = el.value.split("\\")[2];
            // console.log("fileName", fileName);

            var fileMetadata = fileName.split("_");
            var class_date = fileMetadata[1],
                classDate = class_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            var class_period = fileMetadata[2].replace("Per", "").replace(".json", "").replace("_", ", ");
            console.log("classPeriod", class_period);

            this.setState({
                isUploaded: true,
                fileData: {
                    user_id: userId,
                    filename: fileName,
            //         class_topic: "",
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

    render() {
        const { errors } = this.state;

        return (
          <div className="form-container wide">
            <div>
              <h2 className="text-center">
                Upload data
              </h2>
            </div>

            <form noValidate>
                <div className="even-columns-2">
                  <div className="even-column">
                    <input id="data-upload-input" type="file" onChange={(e) => this.parseFile(e)} />

                    {this.state.isUploaded ?
                    <div className="data-upload-metadata">
                      <div className="input-field">
                        <label htmlFor="name">Class Topic</label>
                        <input
                          onChange={this.onChange}
                          value={this.state.name}
                          error={errors.name}
                          id="name"
                          type="text"
                          className={classnames("", {
                            invalid: errors.name
                          })}
                        />
                        <span className="input-field-error-text">{errors.name}</span>
                      </div>

                      <div className="input-field">
                        <label htmlFor="date">Date</label>
                        <input
                          onChange={this.onChange}
                          value={this.state.fileData.class_date}
                          id="class-date"
                          type="date"
                        />
                      </div>

                      <div className="input-field">
                        <label htmlFor="period">Period(s), comma-separated</label>
                        <input
                          onChange={this.onChange}
                          value={this.state.fileData.class_period}
                          id="period"
                          type="text"
                        />
                      </div>
                    </div>
                    : ""}
                  </div>
                  <div className="even-column">
                    {this.state.isUploaded ?
                      <pre className="data-upload-json">
                        {JSON.stringify(this.state.fileData.jsonData, null, 2)}
                      </pre>
                    : ""}
                  </div>
                </div>

              {this.state.isValid ?
                <button type="submit" className="btn btn-submit">
                  Create user
                </button>
              : ""}
            </form>
          </div>
        )
    }
}

UploadDataForm.propTypes = {
    // createUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(
  mapStateToProps,
  {  }
)(withRouter(UploadDataForm));
