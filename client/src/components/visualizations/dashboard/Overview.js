import React, { Component } from "react";

class Overview extends Component {
    render() {
        return (
          <div className="overview-container">
            <div className="overview-heading">
              <h2 className="overview-heading-label">
                Overview
              </h2>
              <select className="overview-heading-dropdown">
                <option>this week</option>
              </select>
              <h2 className="overview-heading-label">
                startDate - endDate
              </h2>
            </div>
          </div>
        );
    }
}

export default Overview;
