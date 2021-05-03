import React from 'react';

import styles from './TextButton.module.css';

interface TextButtonProps {
  text: string,
  icon?: any,
  onClick: () => void,
  disabled?: boolean,
  disabledReason?: string,
}

export default function TextButton({text, icon=null, onClick, disabled, disabledReason}: TextButtonProps) {
  return (
    <div
      className={`${styles.TextButton} ${disabled? styles.Disabled: ""}`}
      onClick={onClick}
      title={disabledReason? disabledReason : text}
    >
      {text} {icon}
    </div>
  );
}
