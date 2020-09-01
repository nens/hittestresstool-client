import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import Leaflet from 'leaflet';

import Popup from '../components/Popup';

import { closePopup, getTemplatedUuid } from '../state/map';
import { getConfiguration } from '../state/session';
import { fetchValueAtPoint } from '../utils/api';

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

  const configuration = useSelector(getConfiguration);
  const templatedUuid = useSelector(getTemplatedUuid);

  useEffect(() => {
    if (!configuration) return;

    (async () => {
      const uuid = configuration.templateUuid;
      const temperature = await fetchValueAtPoint(uuid, latLng);
      if (temperature !== null) {
        setTemperatureOrig(temperature);
      }
    })();

    (async () => {
      if (templatedUuid === null) return;
      const temperature = await fetchValueAtPoint(templatedUuid, latLng);
      if (temperature !== null) {
        setTemperatureEdit(temperature);
      }
    })();

  }, [latLng, configuration, templatedUuid]);

  return (
    <Popup latLng={latLng} onClose={closePopup}>
      <h2>Temperatuur</h2>
      <h2>Voor: {temperatureOrig !== null ? (<span>{temperatureOrig.toFixed(1)}&deg;</span>) : "-"}</h2>
      {templatedUuid !== null ? (
        <h2>Na: {temperatureEdit !== null ? (<span>{temperatureEdit.toFixed(1)}&deg;</span>) : "-"}</h2>
      ) : null}
    </Popup>
  );
}

export default connect(null, {
  closePopup
})(TemperatureMarker);
