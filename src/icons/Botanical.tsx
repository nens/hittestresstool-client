import React from 'react';

import styles from './Pavements.module.css';

interface BotanicalProps {
  active: boolean,
  onClick: () => void
}

const Botanical: React.FC<BotanicalProps> = ({active, onClick}) => (
  <div className={active ? styles.pavementActive : styles.pavementInactive} onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24.39" height="11.052" viewBox="0 0 24.39 11.052">
      <g transform="translate(0 0)">
        <path style={{fill: "#aedb81"}} d="M151.573,151.457h10.8a4.564,4.564,0,0,0-2.895-7.164.743.743,0,0,1-.566-.519,2.666,2.666,0,0,0-3.419-1.694.746.746,0,0,1-.723-.107,5.309,5.309,0,0,0-2.575-1.131,5.412,5.412,0,0,0-.773,0c-3.032,0-4.967,2.474-4.823,5.538A4.991,4.991,0,0,0,151.573,151.457Z" transform="translate(-139.609 -140.786)"/>
        <path style={{fill: "#95cc81"}} d="M137.53,145.591a5.341,5.341,0,0,1,4.579-5.537,5.412,5.412,0,0,0-.774-.056,5.336,5.336,0,0,0-5.329,5.593,5.434,5.434,0,0,0,5.48,5.077h1.524A5.434,5.434,0,0,1,137.53,145.591Z" transform="translate(-129.521 -139.998)"/>
        <g transform="translate(10.289 2.954)">
          <path style={{fill: "#d19a6e"}} d="M413.717,311.439a.382.382,0,0,1-.348-.536l.962-2.167a.381.381,0,0,1,.7.309l-.962,2.167A.381.381,0,0,1,413.717,311.439Z" transform="translate(-403.936 -303.436)"/><path style={{fill: "#d19a6e"}} d="M330.97,244.907a.38.38,0,0,0-.533-.076l-1.175.882-.524-1.467a.381.381,0,1,0-.718.256l1.905,5.335a.381.381,0,1,0,.718-.256l-.924-2.588a.762.762,0,0,1,.26-.866l.915-.686A.381.381,0,0,0,330.97,244.907Z" transform="translate(-322.662 -241.991)"/>
          <path style={{fill: "#d19a6e"}} d="M219.179,202.116a.381.381,0,0,0-.489.226l-.3.826-.855-1.033a.381.381,0,0,0-.587.486l.857,1.036a.762.762,0,0,1,.128.749l-1.907,5.176a.381.381,0,1,0,.715.263l2.668-7.241A.381.381,0,0,0,219.179,202.116Z" transform="translate(-215.998 -201.997)"/>
        </g>
        <path style={{fill: "#95cc81"}} d="M38.4,233.026a3.849,3.849,0,0,0-2.637-3.315,3.689,3.689,0,0,0-1.8-.132.742.742,0,0,1-.661-.2,4.571,4.571,0,0,0-4-1.322l-.137.023a4.13,4.13,0,0,0-3.216,3.842,4.783,4.783,0,0,0,.683,2.481l10.865.076.917-1.143Q38.407,233.181,38.4,233.026Z" transform="translate(-24.688 -223.806)"/>
        <path style={{fill: "#7dbd80"}} d="M18.668,234.927a1.143,1.143,0,0,1-1.143-1.143,4.953,4.953,0,0,1,2.184-4.112,4.575,4.575,0,0,0-3.328,6.323l12.4.076a3.813,3.813,0,0,0,.174-1.143Z" transform="translate(-15.238 -225.399)"/>
        <path style={{fill: "#b57f5f"}} d="M74.268,276.265a.381.381,0,1,0-.73.219L74,278.014l-1.5-.479a.381.381,0,1,0-.232.726l1.616.515a.762.762,0,0,1,.5.507l.3,1.011a.381.381,0,0,0,.73-.219Z" transform="translate(-68.568 -269.514)"/>
        <path style={{fill: "#b57f5f"}} d="M170.093,300.045a.381.381,0,0,0-.52.142l-1.524,2.668a.381.381,0,0,0,.662.378l1.524-2.668A.381.381,0,0,0,170.093,300.045Z" transform="translate(-159.996 -292.372)"/>
        <path style={{fill: "#95cc81"}} d="M24.009,356.76H.381a.381.381,0,0,1,0-.762H24.009a.381.381,0,0,1,0,.762Z" transform="translate(0 -345.708)"/>
      </g>
    </svg>
  </div>
);

export default Botanical;