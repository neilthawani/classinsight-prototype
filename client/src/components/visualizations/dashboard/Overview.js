import React, { Component } from "react";

class Overview extends Component {
    render() {
        return (
          <div className="overview-container">
            <div className="overview-heading">
              <h3 className="overview-heading-label">
                Overview
              </h3>
              <select className="overview-heading-dropdown">
                <option>this week</option>
              </select>
              <h3 className="overview-heading-label">
                startDate - endDate
              </h3>
            </div>
          </div>
        );
    }
}

export default Overview;
