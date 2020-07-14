import React from 'react';
import ReactDOM from 'react-dom';
import TalkRatio from './visualizations/TalkRatio';
import { Button, Utterance } from './visualizations/Transcript';
import TurnTaking from './visualizations/TurnTaking';
import './index.scss';

ReactDOM.render(
  <Utterance />,
  document.getElementById('root')
);
