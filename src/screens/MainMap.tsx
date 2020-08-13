import React, { useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import Leaflet, { LatLng } from 'leaflet';
import {
  Map, TileLayer, WMSTileLayer, GeoJSON
} from 'react-leaflet';

import {
  getOpenBlock,
  getEditing,
  getSelectedPavement,
  Pavement,
  COLORS_PER_PAVEMENT
} from '../state/sidebar';
import {
  mapClickWhileEditingTrees,
  getTreesOnMap,
  getTreesBeingAdded
} from '../state/trees';
import {
  PavementOnMap,
  getPavementsOnMap,
  getPavementsBeingAdded,
  setPavementBeingConstructed,
  getPavementBeingConstructed,
  addPavement,
} from '../state/pavements';

import { getPointsWhereNewPointInLineCrossesExistingLines } from '../utils/polygonUtils';

import TreeMarker from '../icons/TreeLeafletIcon';
import PolygonEditableComponent from './PolygonEditableComponent';

import styles from './MainMap.module.css';

// Since we haven't quite decided at which bounds a given user should start,
// and I'm interested how hot this bedroom I'm working from home in will become,
// let's use it as a temporary default.
const BOUNDS = Leaflet.latLngBounds(Leaflet.latLng({
  "lat": 51.93505786978855,
  "lng": 5.8016395568847665
}), Leaflet.latLng({
  "lat": 52.03887098970015,
  "lng": 6.041107177734376
}));


interface MainMapProps {
  mapClickWhileEditingTrees: (latlng: LatLng) => void,
  addPavement: (polygon: LatLng[], pavement: Pavement) => void,
  setPavementBeingConstructed: (latlngs: LatLng[]) => void,
}

const MainMap: React.FC<MainMapProps> = ({
  mapClickWhileEditingTrees,
  addPavement,
  setPavementBeingConstructed
}) => {
  const openBlock = useSelector(getOpenBlock);
  const editing = useSelector(getEditing);
  const treesOnMap = useSelector(getTreesOnMap);
  const treesBeingAdded = useSelector(getTreesBeingAdded);
  const selectedPavement = useSelector(getSelectedPavement);
  const pavementsOnMap = useSelector(getPavementsOnMap);
  const pavementsBeingAdded = useSelector(getPavementsBeingAdded);
  const pavementBeingConstructed = useSelector(getPavementBeingConstructed);

  // Track location of the mouse pointer, for drawing lines when editing pavements
  const [mouseLatLng, setMouseLatLng] = useState<LatLng>(new LatLng(0, 0));

  // see default public token at https://account.mapbox.com/
  const mapBoxAccesToken = "pk.eyJ1IjoibmVsZW5zY2h1dXJtYW5zIiwiYSI6ImhkXzhTdXcifQ.3k2-KAxQdyl5bILh_FioCw";
  const mapRef = useRef(null);

  const editingTrees = editing && openBlock === 'trees';
  const editingPavements = editing && openBlock === 'pavements';

  const mapClass = (
    editingTrees ?
    styles.MapEditTrees : editingPavements ?
    styles.MapEditPavements : '');

  return (
    <Map
      ref={mapRef}
      zoomControl={false}
      className={mapClass}
      style={{
        height: "100%", width: "100%"
      }}
      bounds={BOUNDS}
      onClick={(event: any) => {
        const latlng: LatLng = event.latlng;

        if (editingTrees) {
          mapClickWhileEditingTrees(latlng);
        } else if (editingPavements) {
          console.log('Click!');
          const intersectionArray = getPointsWhereNewPointInLineCrossesExistingLines(
            latlng, pavementBeingConstructed
          );
          if (intersectionArray.length === 0) {
            console.log('Yes');
            setPavementBeingConstructed(pavementBeingConstructed.concat([latlng]));
          }
        }
      }}
      onMousemove={(event: any) => editingPavements && setMouseLatLng(event.latlng as LatLng)}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
        zIndex={0}
      />
      {openBlock === 'heatstress' ? (
        <WMSTileLayer
          url="https://nxt3.staging.lizard.net/wms/"
          layers="nelen-schuurmans:interactive-heat-stress-model"
        />
      ) : null}
      {openBlock === 'trees' ? (
        <>
          {/* <WMSTileLayer
              url="https://nxt3.staging.lizard.net/wms/"
              layers="nelen-schuurmans:treescmheight-interactive-heat-stress-cp20rxms"
              /> */}
          <GeoJSON
            key={"treesOnMap" + treesOnMap.features.length + editing}
            data={treesOnMap}
            pointToLayer={TreeMarker(editing)}
          />
          <GeoJSON
            key={"treesBeingAdded" + treesBeingAdded.features.length}
            data={treesBeingAdded}
            pointToLayer={TreeMarker()}
          />
        </>
      ) : null}
      {openBlock === 'pavements' ? (
        <>
          <GeoJSON
            key={"pavementsOnMap" + pavementsOnMap.features.length + editing}
            data={pavementsOnMap}
            style={(feature: any) => {
              return {
                color: COLORS_PER_PAVEMENT[(feature as PavementOnMap).properties.pavement],
                opacity: editingPavements ? 0.3 : 1,
                fillOpacity: editingPavements ? 0.1 : 0.25
              };
            }}
          />
          {editingPavements && (
            <GeoJSON
              key={"pavementsBeingAdded" + pavementsBeingAdded.features.length}
              data={pavementsBeingAdded}
              style={(feature: any) => {
                return {
                  color: COLORS_PER_PAVEMENT[(feature as PavementOnMap).properties.pavement]
                };
              }}
            />
          )}
          {editingPavements && pavementBeingConstructed && (
            <PolygonEditableComponent
              polygonPoints={pavementBeingConstructed}
              setPolygonPoints={setPavementBeingConstructed}
              mouseLocation={mouseLatLng}
              setPointsAction={(polygon: LatLng[]) => addPavement(polygon, selectedPavement)}
              polygonColor={COLORS_PER_PAVEMENT[selectedPavement]}
            />
          )}
        </>
      ) : null}

    </Map>
  );
};

export default connect(null, {
  mapClickWhileEditingTrees,
  setPavementBeingConstructed,
  addPavement,
})(MainMap);
