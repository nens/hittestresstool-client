import React, { useRef, useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import Leaflet, { LatLng } from 'leaflet';
import {
  Map, TileLayer, WMSTileLayer, GeoJSON, Pane
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
import {
  getMapState
} from '../state/map';

import { getPointsWhereNewPointInLineCrossesExistingLines } from '../utils/polygonUtils';

import TreeMarker from '../icons/TreeLeafletIcon';
import PolygonEditableComponent from './PolygonEditableComponent';

import styles from './MainMap.module.css';

// Since we haven't quite decided at which bounds a given user should start,
// and I'm interested how hot this bedroom I'm working from home in will become,
// let's use it as a temporary default.
const BOUNDS = Leaflet.latLngBounds(Leaflet.latLng({
  "lat": 50.90416950130772,
  "lng": 6.00904941558838
}), Leaflet.latLng({
  "lat": 50.87758580817798,
  "lng": 5.94776630401611
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
  const mapState = useSelector(getMapState);

  const [leftClip, setLeftClip]= useState<string>('none');

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

  const updateClip = () => {
    const mapRefCurrent = mapRef && mapRef.current;
    if (mapRefCurrent) {
      const leaflet: any = (mapRefCurrent as any).leafletElement!;
      const nw: {x: number, y: number} = leaflet.containerPointToLayerPoint([0, 0])
      const se: {x: number, y: number} = leaflet.containerPointToLayerPoint(leaflet.getSize())
      const clipX = nw.x + mapState.width * mapState.sliderPos;
      setLeftClip(`polygon(${nw.x}px ${nw.y}px, ${clipX}px ${nw.y}px, ${clipX}px ${se.y}px, ${nw.x}px ${se.y}px)`);
    }
  };

  useEffect(updateClip, [mapRef, mapState]);

  return (
    <div style={{
      height: "100%", width: "100%",
      position: "absolute"
    }}
    >
      <Map
        ref={mapRef}
        zoomControl={false}
        className={mapClass}
        style={{
          height: "100%", width: "100%", position: "relative"
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
        onViewportChange={updateClip}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
          zIndex={0}
        />
        {openBlock === 'heatstress' && leftClip ? (
          <Pane style={{clipPath: leftClip}}>
            <WMSTileLayer
              url="https://nxt3.staging.lizard.net/wms/"
              layers="nelen-schuurmans:interactive-heat-stress-model"
            />
          </Pane>
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
    </div>
  );
};

export default connect(null, {
  mapClickWhileEditingTrees,
  setPavementBeingConstructed,
  addPavement,
})(MainMap);
