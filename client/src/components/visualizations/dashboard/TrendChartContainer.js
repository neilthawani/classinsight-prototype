import React, { Component } from "react";
import * as d3 from 'd3';
// import TrendLine from './TrendLine';
import TrendChart from './TrendChart';
import { removePropertyFromObject } from '../../../utils/removePropertyFromObject';
import flattenArray from '../../../utils/flattenArray';
// import toCamelCase from '../../../utils/toCamelCase';
import uuid from 'react-uuid'

export default class TrendChartContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uuid: uuid(),
            circleTooltip: null,
            svg: "",
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
        // console.log("tooltip",tooltip);
        this.setState({
            circleTooltip: tooltip
        });
    }

    parseTime = d3.timeParse("%Y-%m-%d");
    parseData = function(data) {
        return data.map((datum) => {
            // console.log("datum", datum);
            return {
                date: this.parseTime(datum.date),
                score: datum.formattedPercentageValue,
                // percentageValue: datum.percentageValue
            }
        });
    }

    calculateXScale(xScale, data) {
        // console.log("xScale", xScale, "data", data);
        return xScale.domain(d3.extent(data, (d => d.date)));
    }

    calculateYScale(yScale, data) {
        // console.log("yScale", yScale, "data", data);
        var min = Math.ceil(Math.min.apply(Math, data.map(function(row) { return row.score; })));
        var max = Math.ceil(Math.max.apply(Math, data.map(function(row) { return row.score; })) / 5) * 5;

        console.log("yScale", yScale.ticks());
        // console.log("min", min, "max", max);
        return yScale.domain([min, max]);
    }

    componentDidMount() {
        var state = this.state,
            trendLineData = this.props.data.map((dataRow) => {
                var metaData = removePropertyFromObject(dataRow, 'data');

                return this.parseData(dataRow.data).map((datum) => {
                    return {
                        ...datum,
                        ...metaData
                    };
                });//.reverse();
            }),
            margin = state.display.margin,
            svgWidth = document.getElementById(`trend-chart-container-${this.state.uuid}`).clientWidth,
            svgHeight = document.getElementById(`trend-chart-container-${this.state.uuid}`).clientHeight;
        // console.log("parsedData", parsedData);
        // console.log("data", data);
        // console.log("width", width);
        // console.log("svgWidth", svgWidth, "svgHeight", svgHeight);

        var xRange = d3.scaleTime().range([margin.left, svgWidth - margin.right]);
        var yRange = d3.scaleLinear().range([svgHeight - margin.bottom, margin.top]);

        var xScale = this.calculateXScale(xRange, flattenArray(trendLineData));
        var yScale = this.calculateYScale(yRange, flattenArray(trendLineData));

        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
        var yAxis = d3.axisLeft(yScale);

        // var svg = d3.select(`#trend-chart-container-${this.state.uuid}`).append("svg").attr("width", width).attr("height", height).attr("class", "trend-chart");

        this.setState({
            trendLineData: trendLineData,
            // svg: svg,
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
                yAxis: yAxis
            },
            isLoaded: true
        });
    }

    // handleCircleTooltip(text) {
    //     this.props.handleCircleTooltip(text);
    // }

    render() {
        if (this.state.isLoaded) {
            var state = this.state,
                trendLineData = this.state.trendLineData,
                margin = state.display.margin,
                height = state.display.svgHeight - state.display.margin.top - state.display.margin.bottom,
                width = state.display.svgWidth - state.display.margin.left - state.display.margin.right,
                xScale = state.scales.xScale,
                yScale = state.scales.yScale;

            var xAxisTransform = "translate(0," + parseInt(height + margin.bottom, 0) + ")",
                yAxisTransform = `translate(${margin.bottom}, 0)`;

            return (
                <div className="trend-chart-container" id={`trend-chart-container-${this.state.uuid}`}>
                  <TrendChart
                    svgWidth={this.state.display.svgWidth}
                    svgHeight={this.state.display.svgHeight}
                    axes={this.state.axes}
                    xAxisTransform={xAxisTransform}
                    yAxisTransform={yAxisTransform}
                    trendLineData={trendLineData}
                    xScale={xScale}
                    yScale={yScale}
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
