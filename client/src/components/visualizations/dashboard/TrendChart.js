import React, { Component } from "react";
import * as d3 from 'd3';
import TrendLine from './TrendLine';
import { removePropertyFromObject } from '../../../utils/removePropertyFromObject';
import flattenArray from '../../../utils/flattenArray';
import toCamelCase from '../../../utils/toCamelCase';

class TrendChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            svg: "",
            scales: {},
            axes: {},
            display: {
                width: 0,
                height: 0,
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

    parseTime = d3.timeParse("%Y-%m-%d");
    parseData = function(data) {
        return data.map((datum) => {
            // console.log("datum", datum);
            return {
                date: this.parseTime(datum.date),
                score: datum.percentageValue
            }
        });
    }

    calculateXScale(xScale, data) {
        // console.log("xScale", xScale, "data", data);
        return xScale.domain(d3.extent(data, (d => d.date)));
    }

    calculateYScale(yScale, data) {
        // console.log("yScale", yScale, "data", data);
        return yScale.domain([0, 100]);
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
                }).reverse();
            }),
            margin = state.display.margin,
            width = document.getElementById("trend-chart-container").clientWidth,
            height = document.getElementById("trend-chart-container").clientHeight;
        // console.log("parsedData", parsedData);
        // console.log("data", data);
        // console.log("width", width);

        var xScale = d3.scaleTime().range([margin.left, width - margin.right]);
        var yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        var goalXScale = this.calculateXScale(xScale, flattenArray(trendLineData));
        var goalYScale = this.calculateYScale(yScale, trendLineData[3]);

        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
        var yAxis = d3.axisLeft(yScale).ticks(10);

        var svg = d3.select("#trend-chart-container").append("svg").attr("width", width).attr("height", height).attr("class", "trend-chart");

        this.setState({
            trendLineData: trendLineData,
            svg: svg,
            display: {
                ...this.state.display,
                width: width,
                height: height
            },
            scales: {
                goalXScale: goalXScale,
                goalYScale: goalYScale,
            },
            axes: {
                xAxis: xAxis,
                yAxis: yAxis
            },
            isLoaded: true
        });
    }

    render() {
        if (this.state.isLoaded) {
            var state = this.state,
                svg = state.svg,
                trendLineData = this.state.trendLineData,
                margin = state.display.margin,
                height = state.display.height - state.display.margin.top - state.display.margin.bottom,
                width = state.display.width - state.display.margin.left - state.display.margin.right,
                goalXScale = state.scales.goalXScale,
                goalYScale = state.scales.goalYScale,
                xAxis = state.axes.xAxis,
                yAxis = state.axes.yAxis;

            // draw x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + parseInt(height + margin.bottom, 0) + ")")
                .call(xAxis);

            // draw y axis
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", `translate(${margin.bottom}, 0)`)
                .call(yAxis);

            // begin: draw horizontal gridlines
            var ticks = document.getElementsByClassName("y axis")[0].getElementsByClassName("tick");
            for (var i = 1; i < ticks.length; i++) {
                var commaIndex = ticks[i].getAttribute("transform").indexOf(",");
                var transformYWithParen = ticks[i].getAttribute("transform").slice(commaIndex + 1);
                var parenIndex = transformYWithParen.indexOf(")");
                var transformY = transformYWithParen.slice(0, parenIndex);
                svg.append("line").attr("class", "trend-chart-gridline")
                    .attr("x1", margin.left + 1)
                    .attr("x2", width + margin.right)
                    .attr("y1", transformY)
                    .attr("y2", transformY + 1);
            }
            // end: draw horizontal gridlines

            trendLineData.forEach((trendLineDatum, index, array) => {
                var trendLine = d3.line().x((d) => goalXScale(d.date)).y((d) => goalYScale(d.score));

                svg.append("path")
                    .data(trendLineDatum)
                    .attr("class", "trend-chart-path")
                    .attr("stroke", (d) => d.barColor)
                    .attr("d", trendLine(trendLineDatum));
                console.log("trendLineDatum[0]", trendLineDatum[0]);

                svg.selectAll(`circle.${toCamelCase(trendLineDatum[0].text)}`)
                    .data(trendLineDatum).enter().append("circle")
                    .attr("r", 4)
                    .attr("fill", (d) => d.barColor)
                    .attr("cx", (d) => goalXScale(d.date))
                    .attr("cy", (d) => goalYScale(d.score));
            });
        }

        return (
            <div className="overview-trend-chart" id="trend-chart-container">
              
            </div>
        );
    }
}

export default TrendChart;
// http://bl.ocks.org/dhoboy/3cf1259cd6e10e2e4aa1
