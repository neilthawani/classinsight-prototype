import React, { Component } from "react";
import * as d3 from 'd3';
import TrendLine from './TrendLine';
// import { goalCompletion, recapActivity } from '../../fixtures/journey-map-data';

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

    parseTime = d3.timeParse("%Y-%m-%d");//%d-%B-%Y");
    parseData = function(data) {
        return data.map((datum) => {
            // console.log("datum", datum);
            return {
                date: this.parseTime(datum.date),
                score: datum.percentageValue
            }
        });
        // .map((datum, index, array) => {
        //     return {
        //         date: this.parseTime(datum.date),
        //         score: +datum.percentageValue
        //     };
        // });
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
            dataRow = this.props.data[3],//.map((trendLineDatum) => {
                // return trendLineDatum.data;
            // })[3],
            data = this.parseData(dataRow.data),
            margin = state.display.margin,
            width = document.getElementById("trend-chart-container").clientWidth,
            height = document.getElementById("trend-chart-container").clientHeight;

        // console.log("data", data);
        // console.log("width", width);

        var xScale = d3.scaleTime().range([margin.left, width - margin.right]);
        var yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        var goalXScale = this.calculateXScale(xScale, data);
        var goalYScale = this.calculateYScale(yScale, data);

        var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
        var yAxis = d3.axisLeft(yScale).ticks(10);

        var svg = d3.select("#trend-chart-container").append("svg").attr("width", width).attr("height", height).attr("class", "trend-chart");

        this.setState({
            goalData: data,
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
                data = this.state.goalData,
                margin = state.display.margin,
                height = state.display.height - state.display.margin.top - state.display.margin.bottom,
                width = state.display.width - state.display.margin.left - state.display.margin.right,
                goalXScale = state.scales.goalXScale,
                goalYScale = state.scales.goalYScale,
                xAxis = state.axes.xAxis,
                yAxis = state.axes.yAxis;

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + parseInt(height + margin.bottom, 0) + ")")
                .call(xAxis);

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
                    .attr("x1", margin.left)
                    .attr("x2", width + margin.right)
                    .attr("y1", transformY)
                    .attr("y2", transformY + 1);
            }
            // end: draw horizontal gridlines

            var trendLine = d3.line().x((d) => goalXScale(d.date)).y((d) => goalYScale(d.score));
            svg.append("path").attr("class", "trend-chart-path goal").attr("d", trendLine(this.state.goalData));

            svg.selectAll("circle")
                .data(data).enter().append("circle")
                .attr("class", "circle")
                .attr("r", 3)
                .attr("cx", (d) => goalXScale(d.date))
                .attr("cy", (d) => goalYScale(d.score));
        }

        return (
            <div className="overview-trend-chart" id="trend-chart-container">
            </div>
        );
    }
}

export default TrendChart;
// http://bl.ocks.org/dhoboy/3cf1259cd6e10e2e4aa1
