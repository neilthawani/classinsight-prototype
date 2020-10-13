import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

class Sidebar extends Component {
    handleDataRowClick(index) {
        this.props.handleDataRowClick(index);
    }

    render() {
        return (
          <div className="sidebar">
            <div className="sidebar-header">
              <Icon path={mdiDatabase} className="sidebar-header-icon" size={2} />
            </div>
            <div className="sidebar-data">
              {this.props.dataRows.map((item, index, array) => {
                  var datum = item.data;

                  return (
                    <div key={index}
                      className={this.props.activeDataRowIndex === index ? "sidebar-data-row active" : "sidebar-data-row"}
                      onClick={this.handleDataRowClick.bind(this, index)}>
                      <div className="sidebar-data-row-title">
                        {datum.title}
                      </div>

                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Filename:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {datum.original_csv}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Duration:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {new Date(datum.duration * 1000).toISOString().substr(11, 8)}
                        </span>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        );
    }
}

export default Sidebar;
