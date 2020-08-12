import React from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import Block from '../components/Block';
import Land from '../icons/Land';

export default {
  component: Block,
  decorators: [withKnobs],
  title: 'Block'
}

export const closed = () => (
  <Block
    title="Verharding"
    icon={<Land/>}
    status={select("Status", ["closed", "disabled", "opened"], "closed")}
    onOpen={action("Open")}
  >
    <div>This is the first row</div>
    <div>This is the second row</div>
  </Block>
);
