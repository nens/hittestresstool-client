import React from 'react';

import styles from './Icons.module.css';

interface GrassProps {
  active?: boolean
}

const Grass: React.FC<GrassProps> = ({active=false}) => (
  <div className={active ? styles.hardenedActive : styles.hardenedInactive}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16.369" height="15.215" viewBox="0 0 16.369 15.215">
      <path style={{fill: "#33bc00"}} d="M59.915,138.874a29.23,29.23,0,0,1,2.477,11.352h2.565S65.163,141.823,59.915,138.874Z" transform="translate(-57.999 -135.011)"/>
      <path style={{fill: "#008100"}} d="M299.541,138.874a29.23,29.23,0,0,0-2.477,11.352H294.5S294.292,141.823,299.541,138.874Z" transform="translate(-285.082 -135.011)"/>
      <path style={{fill: "#015901"}} d="M377.8,286.434s-1.857,2.211-1.857,6.634h-2.565S372.934,287.908,377.8,286.434Z" transform="translate(-361.43 -277.854)"/>
      <path style={{fill: "#79d60d"}} d="M0,286.434s1.857,2.211,1.857,6.634H4.422S4.865,287.908,0,286.434Z" transform="translate(0 -277.854)"/>
      <path style={{fill: "#00ac00"}} d="M220.986,18.059A43.344,43.344,0,0,0,218.3,33.274h-2.565S215.266,22.924,220.986,18.059Z" transform="translate(-208.831 -18.059)"/>
    </svg>
  </div>
);

export default Grass;
