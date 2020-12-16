import React, { Component } from "react";
import ButtonSelector from './components/ButtonSelector';
import Sidebar from "./components/layout/Sidebar";

class DashboardMenus extends Component {
  handleButtonSelectorClick(value) {
      this.props.handleButtonSelectorClick(value);
  }

  handleSidebarRowClick(value) {
      this.props.handleSidebarRowClick(value);
  }

  render() {
    var { buttonSelectorSelectedOption, dataParsers, activeDataRowIndex } = this.props;
    // console.log("dataParsers", dataParsers);

    return (
      <div className="dashboard-container">
        {/* coarse, medium, and fine-grained visualizations */}
        <ButtonSelector
          buttonSelectorSelectedOption={buttonSelectorSelectedOption}
          handleClick={this.props.handleButtonSelectorClick.bind(this)} />

        <Sidebar
          dataRows={
            (dataParsers || []).map((parser) => {
                // console.log("parser", parser);
                return parser.data;
            })
          }
          activeDataRowIndex={activeDataRowIndex}
          handleSidebarRowClick={this.props.handleSidebarRowClick.bind(this)}/>
      </div>
    )
  }
}

export default DashboardMenus;
