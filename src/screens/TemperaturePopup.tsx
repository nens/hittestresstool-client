import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import Leaflet from 'leaflet';
import { Geometry } from 'geojson';

import Popup from '../components/Popup';
import TextButton from '../components/TextButton';

import { closePopup } from '../state/map';

interface TemperaturePopupProps {
  latLng: Leaflet.LatLng;
  closePopup: () => void;
}

function TemperatureMarker(props: TemperaturePopupProps) {
  const {
    latLng,
    closePopup
  } = props;

  const [temperatureOrig, setTemperatureOrig] = useState<number|null>(null);
  const [temperatureEdit, setTemperatureEdit] = useState<number|null>(null);

  return (
    <Popup latLng={latLng} onClose={closePopup}>
      <h2>Pop up.</h2>
    </Popup>
  );
}

export default connect(null, {
  closePopup
})(TemperatureMarker);
