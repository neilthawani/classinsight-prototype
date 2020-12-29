import React, { Component } from "react";
import ButtonSelector from './components/ButtonSelector';
import Sidebar from "./components/layout/Sidebar";

class DashboardMenus extends Component {
  handleButtonSelectorClick(value) {
      // console.log("DashboardMenus handleButtonSelectorClick", value);
      this.props.handleButtonSelectorClick(value);
  }

  handleSidebarRowClick(value) {
      this.props.handleSidebarRowClick(value);
  }

  render() {
    var { buttonSelectorSelectedOption, admin } = this.props;
    // console.log("dataParsers", dataParsers);

    return (
      <div className="dashboard-container">
        {/* coarse, medium, and fine-grained visualizations */}
        <ButtonSelector
          admin={admin}
          buttonSelectorSelectedOption={buttonSelectorSelectedOption}
          handleClick={this.props.handleButtonSelectorClick.bind(this)} />

        <Sidebar />
      </div>
    )
  }
}

export default DashboardMenus;
