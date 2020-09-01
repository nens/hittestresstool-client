import React from 'react';

import Leaflet from 'leaflet';
import {Marker, Popup as LPopup} from 'react-leaflet';

import { TREE_SVG_DATA_URL } from '../icons/TreeLeafletIcon';

import styles from './Popup.module.css';

interface PopupProps {
  latLng: Leaflet.LatLng;
  onClose: () => void
}

const Popup: React.FC<PopupProps> = (props) => {
  const {
    latLng,
    onClose,
    children
  } = props;

  const icon = Leaflet.icon({
    iconUrl: TREE_SVG_DATA_URL,
    shadowUrl: TREE_SVG_DATA_URL,
    iconSize: [1, 1], // size of the icon
    shadowSize: [1, 1], // size of the shadow
    iconAnchor: [1, 1], // point of the icon which will correspond to marker's location
    shadowAnchor: [1, 1], // the same for the shadow
    popupAnchor: [1, 1] // point from which the popup should open relative to the iconAnchor
  });

  return (
    <Marker
      position={latLng}
      icon={icon}
      key={`popup ${latLng.toString()}`}
      onAdd={(event: any) => event.target.openPopup()}
    >
      <LPopup
        className={styles.Popup}
        onClose={onClose}
        maxHeight={500}
        maxWidth={500}
        autoPan={true}
        autoPanPaddingBottomRight={Leaflet.point(65, 5)}
        autoPanPaddingTopLeft={Leaflet.point(50, 5)}
      >
        {children}
      </LPopup>
    </Marker>
  );
}

export default Popup;
