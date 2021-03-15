import React, { Component } from "react";
import * as d3 from 'd3';

// Note: To use this interface, change the following:
// export default class TrendChartAxis extends Component<AxisProps> {
// constructor(props: AxisProps) {
// interface AxisProps {
//   scale: d3.ScaleLinear<any, any>;
// }

export default class TrendChartAxis extends Component {
    // ref: React.RefObject<SVGGElement>;

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        if (this.ref.current) {
            d3.select(this.ref.current)
            .attr("class", this.props.className)
            .attr("transform", this.props.transform)
            .call(this.props.axis);
        }
    }

    componentDidUpdate() {
        if (this.ref.current) {
            d3.select(this.ref.current)
              .transition()
              .attr("class", this.props.className)
              .attr("transform", this.props.transform)
              .call(this.props.axis);
        }
    }

    render() {
        return (
            <g ref={this.ref} />
        );
    }
}
