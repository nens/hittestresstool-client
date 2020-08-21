import React from 'react';

import { withKnobs, text, number } from '@storybook/addon-knobs';

import Legend from '../components/Legend';

export default {
  component: Legend,
  decorators: [withKnobs],
  title: 'Legend'
}

export const legend = () => (
  <Legend
  wmsServer="https://nxt3.staging.lizard.net/wms"
  style={text("Style", "heatstress:34:46")}
  numSteps={number("Steps", 65)}
  />
);
