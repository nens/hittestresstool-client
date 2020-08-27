import React, { useRef, useState, useEffect } from 'react';

import { Geometry } from 'geojson';
import { connect, useSelector } from 'react-redux';
import Leaflet, { LatLng } from 'leaflet';
import {
  Map, TileLayer, WMSTileLayer, GeoJSON, Pane
} from 'react-leaflet';

import {
  getConfiguration
} from '../state/session';
import {
  Tree,
  getOpenBlock,
  getEditing,
  getSelectedPavement,
  Pavement,
  COLORS_PER_PAVEMENT
} from '../state/sidebar';
import {
  mapClickWhileEditingTrees,
  getTreesOnMap,
  TreeOnMap,
  getTreesBeingAdded,
  removeTree
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
  getMapState,
  clickTree,
  clickPavement
} from '../state/map';

import { getPointsWhereNewPointInLineCrossesExistingLines } from '../utils/polygonUtils';

import TreeMarker from '../icons/TreeLeafletIcon';
import PolygonEditableComponent from './PolygonEditableComponent';
import TreePopup from './TreePopup';
import PavementPopup from './PavementPopup';

import styles from './MainMap.module.css';

interface MainMapProps {
  mapClickWhileEditingTrees: (latlng: LatLng) => void,
  addPavement: (polygon: LatLng[], pavement: Pavement) => void,
  setPavementBeingConstructed: (latlngs: LatLng[]) => void,
  removeTree: (geometry: Geometry, tree: Tree) => void,
  clickTree: (latlng: LatLng, tree: TreeOnMap) => void
  clickPavement: (latlng: LatLng, pavement: PavementOnMap) => void
}

const MainMap: React.FC<MainMapProps> = ({
  mapClickWhileEditingTrees,
  addPavement,
  setPavementBeingConstructed,
  clickTree,
  clickPavement
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
  const configuration = useSelector(getConfiguration);

  const [leftClip, setLeftClip]= useState<string>('none');
  const [rightClip, setRightClip] = useState<string>('none');

  // Track location of the mouse pointer, for drawing lines when editing pavements
  const [mouseLatLng, setMouseLatLng] = useState<LatLng>(new LatLng(0, 0));

  const mapRef = useRef(null);

  const updateClip = () => {
    const mapRefCurrent = mapRef && mapRef.current;
    if (mapRefCurrent) {
      const leaflet: any = (mapRefCurrent as any).leafletElement!;
      const nw: {x: number, y: number} = leaflet.containerPointToLayerPoint([0, 0])
      const se: {x: number, y: number} = leaflet.containerPointToLayerPoint(leaflet.getSize())
      const clipX = nw.x + mapState.width * mapState.sliderPos;
      setLeftClip(`polygon(${nw.x}px ${nw.y}px, ${clipX}px ${nw.y}px, ${clipX}px ${se.y}px, ${nw.x}px ${se.y}px)`);
      setRightClip(`polygon(${clipX}px ${nw.y}px, ${se.x}px ${nw.y}px, ${se.x}px ${se.y}px, ${clipX}px ${se.y}px`);
    }

    return () => {setLeftClip('none'); setRightClip('none')}; // For when the map is closed
  };

  useEffect(updateClip, [mapRef, mapState]);

  if (configuration === null) return null;

  const editingTrees = editing && openBlock === 'trees';
  const editingPavements = editing && openBlock === 'pavements';

  const mapClass = (
    editingTrees ?
    styles.MapEditTrees : editingPavements ?
    styles.MapEditPavements : '');

  const initialBounds = Leaflet.latLngBounds(
    Leaflet.latLng(configuration.initialBounds.sw),
    Leaflet.latLng(configuration.initialBounds.ne)
  );

  const showTwoPanes = mapState.templatedLayer !== null;

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
        bounds={initialBounds}
        onClick={(event: any) => {
          const latlng: LatLng = event.latlng;

          if (editingTrees) {
            mapClickWhileEditingTrees(latlng);
          } else if (editingPavements) {
            const intersectionArray = getPointsWhereNewPointInLineCrossesExistingLines(
              latlng, pavementBeingConstructed
            );
            if (intersectionArray.length === 0) {
              setPavementBeingConstructed(pavementBeingConstructed.concat([latlng]));
            }
          }
        }}
        onMousemove={(event: any) => editingPavements && setMouseLatLng(event.latlng as LatLng)}
        onViewportChange={updateClip}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${configuration.mapboxAccessToken}`}
          zIndex={0}
        />
        {openBlock === 'heatstress' ? (
          <>
            <Pane style={showTwoPanes ? {clipPath: leftClip} : {}}>
              <WMSTileLayer
                key="heatstress-original"
                url="/wms/"
                layers={configuration.originalHeatstressLayer}
                styles={configuration.heatstressStyle}
              />
            </Pane>
            {showTwoPanes ? (
              <Pane style={{clipPath: rightClip}}>
                <WMSTileLayer
                  url="/wms/"
                  layers={mapState.templatedLayer!}
                  styles={configuration.heatstressStyle}
                />
              </Pane>) : null}
          </>
        ) : null}
        {openBlock === 'trees' ? (
          <>
            <WMSTileLayer
              url="/wms/"
              key="trees"
              layers={configuration.originalTreesLayer}
              styles={configuration.treesStyle}
            />
            <GeoJSON
              key={"treesOnMap" + treesOnMap.features.length + editing}
              data={treesOnMap}
              pointToLayer={TreeMarker(editing)}
              onEachFeature={(feature: TreeOnMap, layer) =>
                !editing && layer.on("click", (event) => {
                  clickTree((event as any).latlng, feature);
                })}
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
            <WMSTileLayer
              key="pavements"
              url="/wms/"
              layers={configuration.originalPavementsLayer}
              styles={configuration.pavementsStyle}
            />
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
              onEachFeature={(feature: PavementOnMap, layer) =>
                !editing && layer.on("click", (event) => {
                  console.log("CLICK");
                  clickPavement((event as any).latlng, feature);
                })}
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
        {(mapState.popupLatLng !== null && mapState.popupType === 'tree' && mapState.popupTree) && (
          <TreePopup
            latLng={mapState.popupLatLng}
            tree={mapState.popupTree}
          />
        )}
        {(mapState.popupLatLng !== null && mapState.popupType === 'pavement' && mapState.popupPavement) && (
          <PavementPopup
            latLng={mapState.popupLatLng}
            pavement={mapState.popupPavement}
          />
        )}
      </Map>
    </div>
  );
};

export default connect(null, {
  mapClickWhileEditingTrees,
  setPavementBeingConstructed,
  addPavement,
  removeTree,
  clickTree,
  clickPavement
})(MainMap);
