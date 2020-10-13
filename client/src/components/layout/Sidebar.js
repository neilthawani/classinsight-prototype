import React, { Component } from "react";

import Icon from '@mdi/react';
import { mdiDatabase } from '@mdi/js';

import { format } from 'date-fns';

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
                  var dateObj = datum.metadata.date.split("-").reduce((prev, item, index) => {
                      switch(index) {
                          case 0:
                              prev["year"] = parseInt(item, 10);
                              break;
                          case 1:
                              prev["month"] = parseInt(item, 10) - 1;
                              break;
                          case 2:
                              prev["date"] = parseInt(item, 10);
                              break;
                      }

                      return prev;
                  }, {
                      year: 0,
                      month: 0,
                      date: 0
                  });

                  return (
                    <div key={index}
                      className={this.props.activeDataRowIndex === index ? "sidebar-data-row active" : "sidebar-data-row"}
                      onClick={this.handleDataRowClick.bind(this, index)}>
                      <div className="sidebar-data-row-title">
                        {datum.metadata.topic}
                      </div>

                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Date:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {format(new Date(dateObj['year'], dateObj['month'], dateObj['date']), 'PPP')}
                        </span>
                      </div>
                      <div className="sidebar-data-row-descriptor">
                        <span className="sidebar-data-row-descriptor-label">
                          Period:
                        </span>
                        <span className="sidebar-data-row-descriptor-value">
                          {datum.metadata.period}
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
