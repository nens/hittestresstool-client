import React from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs';

import Slider from '../components/Slider';

export default {
  component: Slider,
  decorators: [withKnobs],
  title: 'Slider'
}

export function slider() {
  return (
    <div style={{background: "blue"}}>
      <Slider
        amount={number("Amount", 3)}
        current={number("Current (from 0)", 0)}
        onChange={action("Set current")}
      />
    </div>
  );
}
