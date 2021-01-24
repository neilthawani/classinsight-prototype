import React, { Component } from "react";

export default class TrendLine extends Component {
    // componentDidMount() {
        // svg.append("path").attr("class", "trend-chart-path goal").attr("d", this.props.trendLineData.trendLine(this.props.trendChartData));

        // svg.selectAll("circle")
        //     .data(this.props.trendChartData).enter().append("circle")
        //     .attr("class", "circle")
        //     .attr("r", 3)
        //     .attr("cx", (d) => xScale(d.date))
        //     .attr("cy", (d) => yScale(d.score));
    // }

    render() {
        // var trendLineData = this.props.trendLineData,

        return (
          <g>
           <path
              className="trend-chart-path goal"
              d={this.props.trendLineData.trendLine(this.props.trendChartData)}
           />
           {this.props.trendLineData.map((point) => {
             return (
               <circle r="3" cx={this.props.xScale(point.date)} cy={this.props.yScale(point.score)} />
             )
           })}
          </g>
        );
    }
}
