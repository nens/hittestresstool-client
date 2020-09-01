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
    steps={[]}
    style={text("Style", "heatstress:34:46")}
  />
);
