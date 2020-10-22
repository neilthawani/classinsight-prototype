import React, { Component } from "react";
import axios from 'axios';

export default class AdminPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            isLoaded: false
        };
    }

    componentDidMount() {
        var that = this;

        axios.get("/api/users/list")
            .then(res => {
                that.setState({
                    users: res && res.data,
                    isLoaded: true
                });
            }).catch(err => {
                // console.error('error', err);
                // that.hasError = true;
        });
    }

    render() {
        if (!this.state.isLoaded) {
            return (
                <div>No</div>
            );
        } else {
            return (
                <div className="admin-container">
                  {this.state.users.map((user) => {
                      console.log("user", user);
                  })}
                </div>
            );
        }
    }
}
