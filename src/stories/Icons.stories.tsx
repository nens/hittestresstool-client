import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

import Botanical from '../icons/Botanical';
import Brick from '../icons/Brick';
import Check from '../icons/Check';
import Close from '../icons/Close';
import Download from '../icons/Download';
import FarmingAndGardening from '../icons/FarmingAndGardening';
import Grass from '../icons/Grass';
import Heat from '../icons/Heat';
import Land from '../icons/Land';
import Pencil from '../icons/Pencil';
import Return from '../icons/Return';
import Road from '../icons/Road';
import Sea from '../icons/Sea';
import Tree from '../icons/Tree';

export default {
  title: 'Icons'
}

export const grass = () => <Grass active={boolean("Active", false)} onClick={action("Grass")} />;
export const brush = () => <Botanical active={boolean("Active", false)} onClick={action("Brush")} />;
export const semipaved = () => <Brick active={boolean("Active", false)} onClick={action("Semipaved")} />;
export const check = () => <Check onClick={action("clicked check")} />;
export const close = () => <Close onClick={action("clicked close")} />;
export const download = () => <Download/>;
export const farmingAndGardening = () => <FarmingAndGardening/>;
export const heat = () => <Heat/>;
export const land = () => <Land/>;
export const pencil = () => <Pencil/>;
export const eturn = () => <Return onClick={action("clicked return")} />;
export const paved = () => <Road active={boolean("Active", false)} onClick={action("Paved")} />;
export const sea = () => <Sea active={boolean("Active", false)} onClick={action("Water")} />;
export const tree = () => <Tree/>;
