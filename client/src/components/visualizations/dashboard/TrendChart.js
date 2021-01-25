import React, { Component } from "react";
import * as d3 from 'd3';
import TrendLine from './TrendLine';
// import { removePropertyFromObject } from '../../../utils/removePropertyFromObject';
// import flattenArray from '../../../utils/flattenArray';
// import toCamelCase from '../../../utils/toCamelCase';
import TrendChartAxis from './TrendChartAxis';

class TrendChart extends Component {
    handleCircleTooltip(tooltip) {
        this.props.handleCircleTooltip(tooltip);
    }

    render() {
        // console.log("this.props.axes", this.props.axes);
        var xScale = this.props.xScale,
            yScale = this.props.yScale,
            trendLine = d3.line().x((d) => xScale(d.date)).y((d) => yScale(d.score));

        return (
            <svg className="trend-chart-svg" width={this.props.svgWidth} height={this.props.svgHeight}>
                {this.props.trendLineData.map((trendLineDatum, index, array) => {
                    var color = trendLineDatum[0].barColor;

                    return (
                      <TrendLine
                        key={index}
                        xScale={xScale}
                        yScale={yScale}
                        trendLine={trendLine}
                        trendLineDatum={trendLineDatum}
                        color={color}
                        handleCircleTooltip={this.handleCircleTooltip.bind(this)} />
                    );
                })}

                {this.props.circleTooltip ?
                  <g className="trend-chart-tooltip-extent">
                    <line
                      x1={xScale(this.props.circleTooltip.date)}
                      y1={yScale(this.props.circleTooltip.score)}
                      x2={xScale(this.props.circleTooltip.date)}
                      y2={this.props.svgHeight - 25} />

                    <line
                      x1={xScale(this.props.circleTooltip.date) + 1}
                      y1={yScale(this.props.circleTooltip.score) + 1}
                      x2={25}
                      y2={yScale(this.props.circleTooltip.score) + 1} />
                  </g>
                : null}

                <TrendChartAxis
                  className="x axis"
                  transform={this.props.xAxisTransform}
                  axis={this.props.axes.xAxis} />

                <TrendChartAxis
                  className="y axis"
                  transform={this.props.yAxisTransform}
                  axis={this.props.axes.yAxis} />
            </svg>
        );
    }
}

export default TrendChart;
// http://bl.ocks.org/dhoboy/3cf1259cd6e10e2e4aa1
