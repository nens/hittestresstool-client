import React from 'react';

import styles from './TextButton.module.css';

interface TextButtonProps {
  text: string,
  icon?: any,
  onClick: () => void
}

export default function TextButton({text, icon=null, onClick}: TextButtonProps) {
  return (
    <div
      className={styles.TextButton}
      onClick={onClick}
      title={text}
    >
      {text} {icon}
    </div>
  );
}
