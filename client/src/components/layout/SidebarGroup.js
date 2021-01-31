import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import calculateLessonDuration from '../../utils/calculateLessonDuration';
import formatDate from '../../utils/formatDate';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

class SidebarGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCollapsed: false,
        };
    }

    toggleGroup(isCollapsed) {
        this.setState({ isCollapsed: !isCollapsed });
    }

    // handleSidebarRowCourseClick(index) {
    //     this.props.handleSidebarRowCourseClick(index);
    // }

    render() {
        var isCollapsed = this.state.isCollapsed;
        var { sidebarSelectedCourse } = this.props;
        // console.log("this.props.datasets.activeDataRowIndex", this.props.datasets.activeDataRowIndex, "sidebarSelectedCourse", sidebarSelectedCourse);

        // console.log("this.props.buttonSelectorSelectedOption", this.props.buttonSelectorSelectedOption);
        // console.log("this.props.match", this.props.match);
        var linkTo = this.props.buttonSelectorSelectedOption === "dashboard" ? `${this.props.match.url}/talk-ratio` : `${this.props.match.url}/${this.props.buttonSelectorSelectedOption}`
        // console.log("linkTo", linkTo);
      //) {
        //     console.log("this.props.history", this.props.history);
        //     this.props.history.push(`/visualization/talk-ratio`);
        // }

        return (
          <div className="sidebar-group-container">
            <div className={isCollapsed ? "sidebar-group-dropdown collapsed" : "sidebar-group-dropdown expanded"} onClick={this.toggleGroup.bind(this, this.state.isCollapsed)}>
              <span className="sidebar-group-dropdown-text">{this.props.label}</span>
              {isCollapsed ?
                <Icon path={mdiChevronUp} size={1} /> :
                <Icon path={mdiChevronDown} size={1} />}
            </div>
            <div className="sidebar-group-data">
              {this.props.datasets.dataParsers.map((item, index, array) => {
                  var datum = item.data;
                  var topic = item.topic,
                      date = formatDate(item.date),
                      period = item.period;

                  return (
                    <Link key={index} to={linkTo} exact="true">
                      <div
                        className={(this.props.datasets.activeDataRowIndex === index) && !this.props.hideActive ? "sidebar-data-row active" : "sidebar-data-row"}
                        onClick={this.props.handleSidebarRowCourseClick.bind(this, index)}>
                        <div className="sidebar-data-row-title">
                          {topic}
                        </div>

                        <div className="sidebar-data-row-descriptor">
                          <span className="sidebar-data-row-descriptor-label">
                            Date:
                          </span>
                          <span className="sidebar-data-row-descriptor-value">
                            {date}
                          </span>
                        </div>
                        <div className="sidebar-data-row-descriptor">
                          <span className="sidebar-data-row-descriptor-label">
                            {period.length > 1 ? "Periods:" : "Period:"}
                          </span>
                          <span className="sidebar-data-row-descriptor-value">
                            {period.join(", ")}
                          </span>
                        </div>
                        <div className="sidebar-data-row-descriptor">
                          <span className="sidebar-data-row-descriptor-label">
                            Duration:
                          </span>
                          <span className="sidebar-data-row-descriptor-value">
                            {calculateLessonDuration(datum.duration)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
              })}
            </div>
          </div>
        )
    }
}

SidebarGroup.propTypes = {
    datasets: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        datasets: state.datasets
    }
};

export default withRouter(connect(
  mapStateToProps,
  { }
)(SidebarGroup));
