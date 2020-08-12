import React from 'react';

import { action } from '@storybook/addon-actions';

import CloseUndoCheckBar from '../components/CloseUndoCheckBar';

export default {
  component: CloseUndoCheckBar,
  title: 'Close, Undo, Check'
}

export const theBar = () => (
  <CloseUndoCheckBar
    onClose={action("close")}
    onUndo={action("undo")}
    onCheck={action("check")}
  />
);
