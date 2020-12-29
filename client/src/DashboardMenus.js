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
        var { buttonSelectorSelectedOption, activeDataRowIndex } = this.props;

        return (
          <div className="dashboard-container">
            {/* coarse, medium, and fine-grained visualizations */}
            <ButtonSelector
              buttonSelectorSelectedOption={buttonSelectorSelectedOption}
              handleClick={this.props.handleButtonSelectorClick.bind(this)} />
              {/*dataRows={
                dataParsers.map((parser) => {
                    return parser.data;
                })
              }*/}
            <Sidebar
              activeDataRowIndex={activeDataRowIndex}
              handleSidebarRowClick={this.props.handleSidebarRowClick.bind(this)}/>
          </div>
        )
    }
}

export default DashboardMenus;
