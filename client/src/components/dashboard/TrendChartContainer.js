import React, { Component } from "react";
import * as d3 from 'd3';
import TrendChart from './TrendChart';
import { removePropertyFromObject } from '../../utils/removePropertyFromObject';
import flattenArray from '../../utils/flattenArray';
import uuid from 'react-uuid'

export default class TrendChartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uuid: uuid(),
            circleTooltip: null,
            scales: {},
            axes: {},
            display: {
                svgWidth: 0,
                svgHeight: 0,
                margin: {
                    top: 25,
                    right: 25,
                    bottom: 25,
                    left: 25
                }
            },
            isLoaded: false
        };
    }

    handleCircleTooltip(tooltip) {
        this.setState({
            circleTooltip: tooltip
        });
    }

    parseTime = d3.timeParse("%Y-%m-%d");
    parseData = function(data) {
        return data.map((datum) => {
            return {
                date: this.parseTime(datum.date),
                score: datum.formattedPercentageValue
            }
        });
    }

    calculateXScale(xScale, data) {
        return xScale.domain(d3.extent(data, (d => d.date)));
    }

    calculateYScale(yScale, data) {
        var min = Math.ceil(Math.min.apply(Math, data.map(function(row) { return row.score; })));
        var max = Math.ceil(Math.max.apply(Math, data.map(function(row) { return row.score; })) / 5) * 5;

        return yScale.domain([min, max]);
    }

    componentDidMount() {
        var state = this.state,
            margin = state.display.margin,
            svgWidth = document.getElementById(`trend-chart-container-${this.state.uuid}`).clientWidth,
            svgHeight = document.getElementById(`trend-chart-container-${this.state.uuid}`).clientHeight;

        var xRange = d3.scaleTime().range([margin.left, svgWidth - margin.right]);
        var yRange = d3.scaleLinear().range([svgHeight - margin.bottom, margin.top]);

        var domainData = this.props.data.map((datum) => this.parseData(datum.data))
        var xScale = this.calculateXScale(xRange, flattenArray(domainData));
        var yScale = this.calculateYScale(yRange, flattenArray(domainData));

        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
        var yAxis = d3.axisLeft(yScale);

        // console.log("state.display.svgHeight", svgHeight);
        var xAxisTransform = "translate(0," + parseInt(svgHeight - margin.top, 0) + ")",
            yAxisTransform = `translate(${margin.bottom}, 0)`;

        this.setState({
            display: {
                ...this.state.display,
                svgWidth: svgWidth,
                svgHeight: svgHeight
            },
            scales: {
                xScale: xScale,
                yScale: yScale,
            },
            axes: {
                xAxis: xAxis,
                yAxis: yAxis,
                transforms: {
                    x: xAxisTransform,
                    y: yAxisTransform
                }
            },
            isLoaded: true
        });
    }

    render() {
        if (this.state.isLoaded) {
            var state = this.state,
                activeFilters = this.props.activeFilters,
                trendLineData = this.props.data.reduce((prev, dataRow) => {
                    if (!activeFilters.includes(dataRow.value)) {
                        var metaData = removePropertyFromObject(dataRow, 'data');

                        var newRow = this.parseData(dataRow.data).map((datum) => {
                            return {
                                ...datum,
                                ...metaData
                            };
                        });

                        prev.push(newRow);
                    }

                    return prev;
                }, []);

            return (
                <div className="trend-chart-container" id={`trend-chart-container-${this.state.uuid}`}>
                  <TrendChart
                    svgWidth={this.state.display.svgWidth}
                    svgHeight={this.state.display.svgHeight}
                    margin={this.state.display.margin}
                    axes={this.state.axes}
                    scales={state.scales}
                    trendLineData={trendLineData}

                    circleTooltip={this.state.circleTooltip}
                    handleCircleTooltip={this.handleCircleTooltip.bind(this)} />

                  <span className="trend-chart-container-tooltip">
                    {this.state.circleTooltip ?
                      `${this.state.circleTooltip.text} (${this.state.circleTooltip.score.toFixed(1)}%)`
                    : null}
                  </span>
                </div>
            );
        }

        return (
          <div className="trend-chart-container" id={`trend-chart-container-${this.state.uuid}`}></div>
        );
    }
}
