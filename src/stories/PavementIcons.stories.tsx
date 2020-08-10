import React from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import PavementIcons from '../components/PavementIcons';

export default {
  component: PavementIcons,
  decorators: [withKnobs],
  title: 'PavementIcons'
}

export const icons = () => (
  <PavementIcons active="grass" setActive={action("setActive")} />
);
