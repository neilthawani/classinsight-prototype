import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

export default class App extends Component {
  constructor(){
    super();
    this.state = {color:[Math.random()*255, Math.random()*255, Math.random()*255]};
    this.randomColor = this.randomColor.bind(this);
  }

  randomColor(){
    this.setState({color:[Math.random()*255, Math.random()*255, Math.random()*255]}
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.randomColor}>Random Color</button>
        <P5Wrapper sketch={sketch} color={this.state.color}></P5Wrapper>
      </div>
    );
  }
}

var sketch = function(p){
    let canvas;

    p.setup = () => {
      canvas = p.createCanvas(300, 200);
      p.noStroke();
    }

    p.draw = () => {
      p.background('orangered');
      p.ellipse(150, 100, 100, 100);
    }

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      if(canvas) //Make sure the canvas has been created
        p.fill(newProps.color);
    }
}
