import React, { Component } from "react";
import * as d3 from 'd3';
import TrendLine from './TrendLine';
import { removePropertyFromObject } from '../../../utils/removePropertyFromObject';
import flattenArray from '../../../utils/flattenArray';
import toCamelCase from '../../../utils/toCamelCase';
import TrendChartAxis from './TrendChartAxis';

class TrendChart extends Component {
    render() {
        // console.log("this.props.axes", this.props.axes);
        var xScale = this.props.xScale,
            yScale = this.props.yScale;

        return (
            <svg className="trend-chart-svg" width={this.props.svgWidth} height={this.props.svgHeight}>
              <TrendChartAxis
                className="x axis"
                transform={this.props.xAxisTransform}
                axis={this.props.axes.xAxis} />

              <TrendChartAxis
                className="y axis"
                transform={this.props.yAxisTransform}
                axis={this.props.axes.yAxis} />

                {this.props.trendLineData.map((trendLineDatum, index, array) => {
                    // console.log("trendLineDatum", trendLineDatum);
                    var trendLine = d3.line().x((d) => xScale(d.date)).y((d) => yScale(d.score));

                    return (
                        <g key={`group-${index}`} className="trend-chart-path-group">
                          <path
                            key={`path-${index}`}
                            className="trend-chart-path"
                            d={trendLine(trendLineDatum)}
                            stroke={trendLineDatum[0].barColor} />

                          {trendLineDatum.map((point, jindex) => {
                            return (
                              <circle key={`circle-${index}-${jindex}`} r="4" fill={point.barColor} cx={xScale(point.date)} cy={yScale(point.score)} />
                            )
                          })}
                        </g>
                    )
                })}
            </svg>
        );
    }
}

export default TrendChart;
// http://bl.ocks.org/dhoboy/3cf1259cd6e10e2e4aa1
