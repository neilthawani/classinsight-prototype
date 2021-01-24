import React, { Component } from "react";

export default class TrendLine extends Component {
    render() {
        return (
          <g>
           <path
              className="trend-chart-path goal"
              d={this.props.trendLine.trendLine(this.props.trendChartData)}
           />
           {this.props.trendChartData.map((point, index) => {
             return (
               <circle
                key={`circle-${index}`}
                r="3"
                cx={this.props.xScale(point.date)}
                cy={this.props.yScale(point.score)} />
             )
           })}
          </g>
        );
    }
}
