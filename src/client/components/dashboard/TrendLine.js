import React, { Component } from "react";
import TrendLinePoint from './TrendLinePoint';

export default class TrendLine extends Component {
    handleCircleTooltip(tooltip) {
        this.props.handleCircleTooltip(tooltip);
    }

    render() {
        var xScale = this.props.xScale,
            yScale = this.props.yScale,
            trendLine = this.props.trendLine,
            trendLineDatum = this.props.trendLineDatum,
            color = this.props.color;

        return (
          <g className="trend-chart-path-group">
            <path
              className="trend-chart-line"
              d={trendLine(trendLineDatum)}
              stroke={color} />

            {trendLineDatum.map((point, index) => {
              return (
                <TrendLinePoint
                  key={`circle-${index}`}
                  xScale={xScale}
                  yScale={yScale}
                  point={point}
                  handleCircleTooltip={this.handleCircleTooltip.bind(this)} />
              )
            })}
          </g>
        );
    }
}
