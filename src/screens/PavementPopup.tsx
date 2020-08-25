import React from 'react';
import { connect } from 'react-redux';
import Leaflet from 'leaflet';
import { Geometry } from 'geojson';

import Popup from '../components/Popup';
import TextButton from '../components/TextButton';

import { Pavement } from '../state/sidebar';
import { closePopup } from '../state/map';
import { PavementOnMap, removePavement } from '../state/pavements';

interface PavementPopupProps {
  latLng: Leaflet.LatLng;
  pavement: PavementOnMap;
  removePavement: (geom: Geometry, pavement: Pavement) => void;
  closePopup: () => void;
}

function PavementMarker(props: PavementPopupProps) {
  const {
    latLng,
    pavement,
    removePavement,
    closePopup
  } = props;

  return (
    <Popup latLng={latLng} onClose={closePopup}>
      <h2>Verharding: {
        pavement.properties.pavement === 'water' ? "Water" :
        pavement.properties.pavement === 'grass' ? "Gras" :
        pavement.properties.pavement === 'shrub' ? "Struikgewas" :
        pavement.properties.pavement === 'semipaved' ? "Halfverhard" :
        pavement.properties.pavement === 'paved' ? "Verhard" :
        "Onbekend"
      }</h2>
      <TextButton
        text={"Verwijder"}
        onClick={() => removePavement(pavement.geometry, pavement.properties.pavement)}
      />
    </Popup>
  );
}

export default connect(null, {
  removePavement,
  closePopup
})(PavementMarker);
