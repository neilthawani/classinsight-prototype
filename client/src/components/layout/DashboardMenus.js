import React, { Component } from "react";
import ButtonSelector from './ButtonSelector';
import Sidebar from "./Sidebar";

class DashboardMenus extends Component {
    render() {
        var { buttonSelectorSelectedOption, sidebarSelectedCourse, admin } = this.props;

        return (
          <div>
            {/* coarse, medium, and fine-grained visualizations */}
            <ButtonSelector
              admin={admin}
              buttonSelectorSelectedOption={buttonSelectorSelectedOption}
              handleClick={this.props.handleButtonSelectorClick.bind(this)} />

            <Sidebar
              buttonSelectorSelectedOption={buttonSelectorSelectedOption}
              sidebarSelectedCourse={sidebarSelectedCourse}
              handleSidebarRowCourseClick={this.props.handleSidebarRowCourseClick.bind(this)}
              />
          </div>
        )
    }
}

export default DashboardMenus;
