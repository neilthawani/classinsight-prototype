import React, { Component } from "react";
import * as d3 from 'd3';

interface AxisProps {
  scale: d3.ScaleLinear<any, any>;
}

export default class TrendChartAxis extends React.Component<AxisProps> {
    ref: React.RefObject<SVGGElement>;

    constructor(props: AxisProps) {
        super(props);
        // console.log("props", props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        if (this.ref.current) {
            d3.select(this.ref.current)
            .attr("class", this.props.className)
            .attr("transform", this.props.transform)
            .call(this.props.axis);//d3.axisLeft(this.props.scale));
        }
    }

    componentDidUpdate() {
        if (this.ref.current) {
            d3.select(this.ref.current)
              .transition()
              .attr("class", this.props.className)
              .attr("transform", this.props.transform)
              .call(this.props.axis);//d3.axisLeft(this.props.scale));
        }
    }

    render() {
        // console.log("this.props.style", this.props.style);
        return (
            <g ref={this.ref} />
        );
    }
}
