import React from 'react';

import { IconRow } from './Block';

import Close from '../icons/Close';
import Return from '../icons/Return';
import Check from '../icons/Check'

interface CloseUndoCheckBarProps {
  onClose: () => void,
  onUndo: () => void,
  onCheck: () => void,
}

export default function CloseUndoCheckBar({
  onClose, onUndo, onCheck
}: CloseUndoCheckBarProps) {
  return (
    <IconRow>
      <Close onClick={onClose} />
      <Return onClick={onUndo} />
      <Check onClick={onCheck} />
    </IconRow>
  );
}
