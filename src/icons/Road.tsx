import React from 'react';

import styles from './Icons.module.css';

interface RoadProps {
  active?: boolean
}

const Road: React.FC<RoadProps> = ({active=false}) => (
  <div className={active ? styles.hardenedActive : styles.hardenedInactive}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g transform="translate(0 0)"><path style={{fill: "#c8d2dc"}} d="M399.92,0h-2.99L396.3,8l.625,8h2.99Zm0,0" transform="translate(-383.92 0)"/><path style={{fill: "#2d2d2d"}} d="M241.62,0h-5.01l-.625,8,.625,8h5.01Zm0,0" transform="translate(-228.61 0)"/><path style={{fill: "#3f4a4a"}} d="M76.286,0,75.66,8l.626,8H81.3V0Zm0,0" transform="translate(-73.296 0)"/><path style={{fill: "#dce6eb"}} d="M0,0H2.99V16H0ZM0,0" transform="translate(0 0)"/><g transform="translate(7.531 1.495)"><path style={{fill: "#fff5f5"}} d="M241,47.84h.938v3.229H241Zm0,0" transform="translate(-241 -47.84)"/><path style={{fill: "#fff5f5"}} d="M241,204.332h.938v3.229H241Zm0,0" transform="translate(-241 -199.441)"/><path style={{fill: "#fff5f5"}} d="M241,360.824h.938v3.229H241Zm0,0" transform="translate(-241 -351.043)"/></g></g></svg>
  </div>
);

export default Road;
