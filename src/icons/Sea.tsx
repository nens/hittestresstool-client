import React from 'react';

import styles from './Pavements.module.css';

interface SeaProps {
  active: boolean,
  onClick: () => void
}

const Sea: React.FC<SeaProps> = ({active, onClick}) => (
  <div
    className={active ? styles.pavementActive : styles.pavementInactive}
    onClick={onClick}
    title="Water"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.333" viewBox="0 0 16 15.333">
      <g transform="translate(0 0)">
        <path style={{fill: "#ccf2fe"}} d="M15.333,138.15c-.4,0-.8-.067-1,.333a2.041,2.041,0,0,1-2.733.733,1.937,1.937,0,0,1-.733-.733.748.748,0,0,0-1.267,0,2.041,2.041,0,0,1-2.733.733,1.937,1.937,0,0,1-.733-.733.656.656,0,0,0-1.133,0,2.041,2.041,0,0,1-2.733.733c-.533-.267-.733-1-1.267-1.067-.467-.067-1,.133-1,.667v7.333a.63.63,0,0,0,.667.667H15.333A.63.63,0,0,0,16,146.15v-7.333A.63.63,0,0,0,15.333,138.15Z" transform="translate(0 -134.15)"/>
        <path style={{fill: "#34cdfa"}} d="M15.333,287.484h-.4a.7.7,0,0,0-.6.333,2.041,2.041,0,0,1-2.733.733,1.937,1.937,0,0,1-.733-.733.748.748,0,0,0-1.267,0,2.041,2.041,0,0,1-2.733.733c-.467-.267-.733-1.067-1.333-1.067.2,0-.133,0-.2.067a.666.666,0,0,0-.333.267,2.041,2.041,0,0,1-2.733.733c-.533-.267-.733-1-1.333-1.067-.467-.067-.933.133-.933.667v5.333a.63.63,0,0,0,.667.667H15.333a.63.63,0,0,0,.667-.667v-5.333A.63.63,0,0,0,15.333,287.484Z" transform="translate(0 -278.817)"/>
        <g transform="translate(7.333 0)">
          <ellipse style={{fill: "#67d9fb"}} cx="0.667" cy="0.667" rx="0.667" ry="0.667" transform="translate(0 1.333)"/>
          <ellipse style={{fill: "#67d9fb"}} cx="0.667" cy="0.667" rx="0.667" ry="0.667" transform="translate(4.667 2.667)"/>
          <ellipse style={{fill: "#67d9fb"}} cx="0.667" cy="0.667" rx="0.667" ry="0.667" transform="translate(4)"/>
        </g>
      </g>
    </svg>
  </div>
);

export default Sea;
