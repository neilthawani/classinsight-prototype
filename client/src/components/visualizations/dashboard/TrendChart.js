import React, { Component } from "react";
import * as d3 from 'd3';
import TrendLine from './TrendLine';
import { removePropertyFromObject } from '../../../utils/removePropertyFromObject';
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

    // calculateYScale(yScale, data) {
    //     // console.log("yScale", yScale, "data", data);
    //     return yScale.domain([0, 100]);
    // }

    componentDidMount() {
        var state = this.state,
            // dataRow = this.props.data[3],//.map((trendLineDatum) => {
                // return trendLineDatum.data;
            // })[3],
            data = this.props.data.map((dataRow) => {
                // console.log("dataRow", dataRow);
                var parsedData = this.parseData(dataRow.data);
                var metaData = removePropertyFromObject(dataRow, 'data');
                // console.log("metaData", metaData);
                var parsedDataRows = parsedData.map((parsedDatum) => {
                    return {
                        ...parsedDatum,
                        ...metaData
                    }
                });

                return parsedDataRows;
                // console.log("ret", ret);
                // return ret;
                // var parsedp = parsedData.map((parsedDatum) => {
                //     console.log("parsedDatum", parsedDatum);
                // });

                // return parsedData; //{
                    // parsedData
                // return {...parsedData, ...metaData};
                // };
            }),
            // this.parseData(dataRow.data),
            margin = state.display.margin,
            width = document.getElementById("trend-chart-container").clientWidth,
            height = document.getElementById("trend-chart-container").clientHeight;

        // console.log("data", data);
        // console.log("width", width);

        var xScaleRange = d3.scaleTime().range([margin.left, width - margin.right]);
        var yScaleRange = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        var xScale = this.calculateXScale(xScaleRange, [].concat.apply([], data));
        var yScale = yScaleRange.domain([0, 100]);//this.calculateYScale(yScaleRange, data);

        var xAxis = d3.axisBottom(xScaleRange).tickFormat(d3.timeFormat("%m-%d"));
        var yAxis = d3.axisLeft(yScaleRange).ticks(10);

        // height = state.display.height - state.display.margin.top - state.display.margin.bottom,
        // width = state.display.width - state.display.margin.left - state.display.margin.right,

        this.setState({
            data: data,
            // svg: svg,
            display: {
                ...this.state.display,
                width: width - state.display.margin.left - state.display.margin.right,
                height: height - state.display.margin.top - state.display.margin.bottom,
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

    render() {
        if (this.state.isLoaded) {
            var state = this.state,
                // svg = state.svg,
                data = this.state.data,
                margin = state.display.margin,
                height = state.display.height,// - state.display.margin.top - state.display.margin.bottom,
                width = state.display.width,// - state.display.margin.left - state.display.margin.right,
                xScale = state.scales.xScale,
                yScale = state.scales.yScale,
                xAxis = state.axes.xAxis,
                yAxis = state.axes.yAxis,
                trendLineData = [];

            // var svg = document.querySelector("#trend-chart-container svg");
            var svg = d3.select("#trend-chart-container").append("svg").attr("width", width).attr("height", height).attr("class", "trend-chart");
            // <g className="x axis" transform={`translate(0, ${parseInt(height + margin.bottom, 0)})`} />
            // <g className="y axis" transform={`translate(${margin.bottom}, 0)`} />

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

            trendLineData = data.map((parsedDataRow) => {
                var trendLine = d3.line().x((d) => xScale(parsedDataRow.date)).y((d) => yScale(parsedDataRow.score));
                // console.log("parsedDataRow", parsedDataRow);
                // return trendLine;

                return {
                    trendLine: trendLine,
                }
            });
        }

        console.log("trendLineData", trendLineData);

// trendLineData={trendLineDatum}
        return (
            <div className="overview-trend-chart" id="trend-chart-container">
              {/*<svg className="trend-chart" width={width} height={height}>*/}
                {/*(trendLineData || []).map((trendLineDatum, index, array) => {
                    return (
                      <TrendLine
                        key={index}
                        trendLineData={trendLineDatum}
                        trendChartData={data}
                        xScale={xScale}
                        yScale={yScale}
                      />
                    );
                })*/}
              {/*</svg>*/}
            </div>
        );
    }
}

export default TrendChart;
// http://bl.ocks.org/dhoboy/3cf1259cd6e10e2e4aa1
