import React, { Component } from 'react';
import Bar from './Bar';
import LegendItemGroup from '../../legend/LegendItemGroup';

// import Icon from '@mdi/react';
// import { mdiArrowCollapseVertical, mdiArrowExpandVertical } from '@mdi/js';

import removeArrayValue from '../../../utils/removeArrayValue';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class TurnTaking extends Component {
    constructor(props) {
        super(props);

        // var bars = localStorage.getItem("bars") || "expanded",
            // activeFilters = [];

        this.state = {
            // bars: bars,
            activeFilters: [],//activeFilters,
            activeTurn: {}
        };
    }

    // toggleExpandedBars = function(value, context) {
    //     this.setState({ "bars": value });
    //     localStorage.setItem("bars", value);
    // }

    // barsStateIcon = {
    //     "expanded": <Icon
    //       path={mdiArrowCollapseVertical}
    //       className="turn-taking-visualization-heading-icon"
    //       onClick={this.toggleExpandedBars.bind(this, "collapsed")}
    //       size={1} />,
    //     "collapsed": <Icon
    //       path={mdiArrowExpandVertical}
    //       className="turn-taking-visualization-heading-icon"
    //       onClick={this.toggleExpandedBars.bind(this, "expanded")}
    //       size={1} />
    // }

    // same logic as in Transcript::handleClick
    handleFilterClick(label) {
        var activeFilters = this.state.activeFilters;

        // debugger;
        var isFilterActive = activeFilters.some(filter => label.speakerType === filter.speakerType && label.code === filter.code);
        console.log("isFilterActive", isFilterActive);

        if (isFilterActive) {
            console.log('remove filter');
            activeFilters = removeArrayValue(label, activeFilters)
        } else {
            console.log('add filter');
            activeFilters.push(label);
        }

        console.log("activeFilters", activeFilters);

        this.setState({
            activeFilters: activeFilters
        });
    }

    handleBarClick(value) {
        if (value.id === this.state.activeTurn.id) {
            value = {};
        }

        this.setState({
            activeTurn: value
        });
    }

    handleTextClick(turnId) {
        var slashTurnTaking = this.props.location.pathname.slice(this.props.location.pathname.lastIndexOf("/"));
        var newPathname = this.props.location.pathname.replace(slashTurnTaking, `/transcript#${turnId}`);
        this.props.history.push(newPathname);
    }

    render() {
        var areDatasetsLoaded = this.props.datasets.activeParser;

        if (!areDatasetsLoaded) {
            return null;
        }

        var parser = this.props.datasets.activeParser,
            chartData = parser.filteredTranscript({activeFilters: this.state.activeFilters}) || [];

        // console.log("chartData", chartData);
        // console.log("parser", parser);
        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-legend-teacher">
                <LegendItemGroup
                  labels={parser.legendLabels({ type: "Teacher"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>
                {/*<LegendItemGroup
                  labels={parser.legendLabels({ type: "Technique"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>*/}
              </div>
              <div className="turn-taking-visualization">
                <div className="turn-taking-visualization-headings">
                  <h2 className="turn-taking-visualization-heading">
                    Teacher Talk
                    {/*{this.barsStateIcon[this.state.bars]}*/}
                  </h2>

                  <h2 className="turn-taking-visualization-heading">
                    Student Talk
                  </h2>
                </div>
                {chartData.map((item, index) => {
                    return (
                      <Bar
                        key={index}
                        data={item}
                        handleBarClick={this.handleBarClick.bind(this)}
                        handleTextClick={this.handleTextClick.bind(this)}
                        activeTurn={this.state.activeTurn} />
                    )
                })}
              </div>
              <div className="turn-taking-legend-student">
                <LegendItemGroup
                  labels={parser.legendLabels({ type: "Student"})}
                  activeFilters={this.state.activeFilters}
                  handleClick={this.handleFilterClick.bind(this) }/>
              </div>
            </div>
        );
    }
}


TurnTaking.propTypes = {
    datasets: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
    }
};

export default withRouter(connect(
  mapStateToProps,
  { }
)(TurnTaking));
