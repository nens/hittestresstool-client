import React from 'react';

import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import Block, { IconRow } from '../components/Block';
import Land from '../icons/Land';

import Sea from '../icons/Sea';
import Grass from '../icons/Grass';
import Botanical from '../icons/Botanical';
import Brick from '../icons/Brick';
import Road from '../icons/Road';

import Close from '../icons/Close';
import Return from '../icons/Return';
import Check from '../icons/Check';

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
    <IconRow> <Sea/> <Grass active={true} /> <Botanical/> <Brick/> <Road/> </IconRow>
    <IconRow> <Close/> <Return/> <Check/> </IconRow>
  </Block>
);
