// Block in the sidebar

// First row has a title and an icon
// Later rows aren't shown unless status is "opened"
// Later rows are passed as children, they are rendered centered horizontally

import React from 'react';

import styles from './Block.module.css';

type BlockStatus = 'closed' | 'opened' | 'disabled';

export interface BlockProps {
  title: JSX.Element | string,
  icon: any,
  status: BlockStatus,
  onOpen?: () => void, // Function called is status = closed and clicked on title
  children?: any,
  // alsoRenderChildrenIfClosed?: boolean,
}

export const IconRow: React.FC<{children: any}> = ({children}) => {
  return (
    <div className={styles.sidebarBlockRow}>
      {children}
    </div>
  );
}

const Block: React.FC<BlockProps> = ({title, icon, status, children, onOpen, /*alsoRenderChildrenIfClosed*/}: BlockProps) => {
  const clickable = (status === 'closed' && onOpen);

  let className = styles.sidebarBlock;

  switch (status) {
    case 'disabled':
      className = `${className} ${styles.sidebarBlockDisabled}`;
      break;
    case 'opened':
      className = `${className} ${styles.sidebarBlockOpened}`;
      break;
    default:
      className = `${className} ${styles.sidebarBlockClosed}`;
  }

  return (
    <div className={className} onClick={() =>
      (clickable ? onOpen!() : null)
    }>
      <div className={styles.sidebarBlockRow}>
        <h2
          className={styles.sidebarBlockTitle}
        >{title}</h2>
        <div className={styles.sidebarBlockIcon}>
          {icon}
        </div>
      </div>
      {(status === 'opened') /*|| alsoRenderChildrenIfClosed*/ ? children : null}
    </div>
  );
};

export default Block;
