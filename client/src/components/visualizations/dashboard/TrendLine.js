import React, { Component } from "react";

export default class TrendLine extends Component {
    render() {
        var xScale = this.props.xScale,
            yScale = this.props.yScale,
            trendLine = this.props.trendLine,
            trendLineDatum = this.props.trendLineDatum,
            color = this.props.color;

        return (
          <g className="trend-chart-path-group">
            <path
              className="trend-chart-path"
              d={trendLine(trendLineDatum)}
              stroke={color} />

            {trendLineDatum.map((point, index) => {
              return (
                <circle key={`circle-${index}`} r="4" fill={point.barColor} cx={xScale(point.date)} cy={yScale(point.score)} />
              )
            })}
          </g>
        );
    }
}
