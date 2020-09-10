import React, { Component } from 'react';
import CollapsedBar from './CollapsedBar';

import Parser from '../../../data/parser';

export default class TurnTakingCollapsed extends Component {
    render() {
        var chartData = Parser.parsedData();

        return (
            <div className="turn-taking-visualization-container">
              <div className="turn-taking-visualization">
                {chartData.map((item, index) => {
                    return (
                      <CollapsedBar key={index} data={item} />
                    )
                })}
              </div>
            </div>
        );
    }
}
