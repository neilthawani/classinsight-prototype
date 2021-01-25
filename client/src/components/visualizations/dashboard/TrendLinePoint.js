import React, { Component } from "react";

export default class TrendLinePoint extends Component {
    handleCircleTooltip(point) {
        this.props.handleCircleTooltip(point);
    }

    render() {
        var xScale = this.props.xScale,
            yScale = this.props.yScale,
            point = this.props.point;

        return (
          <g>
            <circle
              className="trend-chart-line-point"
              onMouseOver={this.handleCircleTooltip.bind(this, this.props.point)}
              onMouseOut={this.handleCircleTooltip.bind(this, null)}
              r="4"
              fill={point.barColor}
              cx={xScale(point.date)}
              cy={yScale(point.score)} />
          </g>
        )
    }
}
