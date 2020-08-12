import React from 'react';

import styles from './Icons.module.css';

interface CloseProps {
  onClick: () => void
}

const Close: React.FC<CloseProps> = ({onClick}) => (
  <div className={styles.closeIcon} onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{fill: "#5a5152"}} d="M24,2.4,21.6,0,12,9.6,2.4,0,0,2.4,9.6,12,0,21.6,2.4,24,12,14.4,21.6,24,24,21.6,14.4,12Z"/></svg>
  </div>
);

export default Close;
