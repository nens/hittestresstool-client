import React from 'react';

import styles from './TextButton.module.css';

interface TextButtonProps {
  text: string,
  icon: any,
  onClick: () => void
}

export default function TextButton({text, icon, onClick}: TextButtonProps) {
  return (
    <div className={styles.TextButton} onClick={onClick}>
      {text} {icon}
    </div>
  );
}