import React, { useRef, useState, useEffect } from 'react';

import { Geometry } from 'geojson';
import { connect, useSelector } from 'react-redux';
import Leaflet, { LatLng } from 'leaflet';
import {
  Map, TileLayer, WMSTileLayer, GeoJSON, Pane
} from 'react-leaflet';

import {
  getConfiguration,
  getLegendSteps
} from '../state/session';
import {
  Tree,
  getOpenBlock,
  getEditing,
  getSelectedPavement,
  getSelectedTree,
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
  getReportPolygonsOnMap,
  getReportPolygonsBeingAdded,
  setReportPolygonBeingConstructed,
  getReportPolygonsBeingConstructed,
  addReportPolygon,
} from '../state/reportPolygons';
import {
  getMapState,
  clickTree,
  clickPavement,
  clickTemperature,
} from '../state/map';
import {
  addMessage,
  getMessage,
  getMessageVisible
} from '../state/message';

import { getPointsWhereNewPointInLineCrossesExistingLines } from '../utils/polygonUtils';

import TreeMarker from '../icons/TreeLeafletIcon';
import PolygonEditableComponent from './PolygonEditableComponent';
import TreePopup from './TreePopup';
import PavementPopup from './PavementPopup';
import TemperaturePopup from './TemperaturePopup';
import Legend from '../components/Legend';
import Message from '../components/Message';

import styles from './MainMap.module.css';

interface MainMapProps {
  mapClickWhileEditingTrees: (latlng: LatLng) => void,
  addPavement: (polygon: LatLng[], pavement: Pavement) => void,
  addReportPolygon: (polygon: LatLng[]) => void,
  setPavementBeingConstructed: (latlngs: LatLng[]) => void,
  setReportPolygonBeingConstructed: (latlngs: LatLng[]) => void,
  removeTree: (geometry: Geometry, tree: Tree) => void,
  clickTree: (latlng: LatLng, tree: TreeOnMap) => void
  clickPavement: (latlng: LatLng, pavement: PavementOnMap) => void,
  clickTemperature: (latlng: LatLng) => void,
  addMessage: (message: string) => void,
}

const MainMap: React.FC<MainMapProps> = ({
  mapClickWhileEditingTrees,
  addMessage,
  addPavement,
  setPavementBeingConstructed,
  addReportPolygon,
  setReportPolygonBeingConstructed,
  clickTree,
  clickPavement,
  clickTemperature
}) => {
  const openBlock = useSelector(getOpenBlock);
  const editing = useSelector(getEditing);
  const treesOnMap = useSelector(getTreesOnMap);
  const treesBeingAdded = useSelector(getTreesBeingAdded);
  const selectedPavement = useSelector(getSelectedPavement);
  const pavementsOnMap = useSelector(getPavementsOnMap);
  const pavementsBeingAdded = useSelector(getPavementsBeingAdded);
  const pavementBeingConstructed = useSelector(getPavementBeingConstructed);

  const reportPolygonsOnMap = useSelector(getReportPolygonsOnMap);
  const reportPolygonsBeingAdded = useSelector(getReportPolygonsBeingAdded);
  const reportPolygonBeingConstructed = useSelector(getReportPolygonsBeingConstructed);

  const mapState = useSelector(getMapState);
  const configuration = useSelector(getConfiguration);
  const legendSteps = useSelector(getLegendSteps);
  const message = useSelector(getMessage);
  const messageVisible = useSelector(getMessageVisible);
  const selectedTree = useSelector(getSelectedTree);

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
  const editingReportPolygons = editing && openBlock === 'report';

  const mapEditTreesStyle = (
    selectedTree === 'tree_5m' ? styles.MapEditTrees5 :
    selectedTree === 'tree_15m' ? styles.MapEditTrees15 :
    styles.MapEditTrees10);

  const mapClass = (
      editingTrees ?
      mapEditTreesStyle : editingPavements ?
      styles.MapEditPavements : editingReportPolygons ?
      styles.MapEditReportPolygon : '');

  const initialBounds = Leaflet.latLngBounds(
    Leaflet.latLng(configuration.initialBounds.sw),
    Leaflet.latLng(configuration.initialBounds.ne)
  );

  const maxBounds = configuration.maxBounds ? Leaflet.latLngBounds(
      Leaflet.latLng(configuration.maxBounds.sw),
      Leaflet.latLng(configuration.maxBounds.ne)
  ) : initialBounds;

  const minZoom = configuration.minZoom !== undefined ? configuration.minZoom : 15;

  const showTwoPanes = mapState.templatedLayer !== null;

  return (
    <Map
      ref={mapRef}
      zoomControl={false}
      style={{
        height: "100%", width: "100%",
        position: "relative"
      }}
      className={mapClass}
      bounds={initialBounds}
      maxBounds={maxBounds}
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
        } else if (editingReportPolygons && reportPolygonsBeingAdded.features.length === 0) {
          const intersectionArray = getPointsWhereNewPointInLineCrossesExistingLines(
            latlng, reportPolygonBeingConstructed
          );
          if (intersectionArray.length === 0) {
            setReportPolygonBeingConstructed(reportPolygonBeingConstructed.concat([latlng]));
          }
        } else if (openBlock === 'heatstress') {
          clickTemperature(latlng);
        }
      }}
      onMousemove={(event: any) => (editingPavements || editingReportPolygons ) && setMouseLatLng(event.latlng as LatLng)}
      onViewportChange={updateClip}
      minZoom={minZoom}
      maxZoom={25}
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
              updateWhenIdle={true}
              updateWhenZooming={false}
              updateInterval={1000}
            />
          </Pane>
          {showTwoPanes ? (
            <Pane style={{clipPath: rightClip}}>
              <WMSTileLayer
                url="/wms/"
                layers={mapState.templatedLayer!}
                styles={configuration.heatstressStyle}
                updateWhenIdle={true}
                updateWhenZooming={false}
                updateInterval={1000}
              />
            </Pane>) : null}
          {legendSteps !== null && (
            <Legend steps={legendSteps} style={configuration.heatstressStyle}/>
          )}
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
              setPointsAction={(polygon: LatLng[]) => {
                addPavement(polygon, selectedPavement);
                addMessage("Verharding geplaatst");
              }}
              polygonColor={COLORS_PER_PAVEMENT[selectedPavement]}
            />
          )}
        </>
      ) : null}
      {/* _______________________________________________________________________________________________ REPORT */}
      {openBlock === 'report' ? (
        <>
          {!editingReportPolygons? <GeoJSON
            key={"reportPolygonsOnMap" + reportPolygonsOnMap.features.length + editing}
            data={reportPolygonsOnMap}
          />:null}
          {editingReportPolygons && (
            <GeoJSON
              key={"reportPolygonsBeingAdded" + reportPolygonsBeingAdded.features.length}
              data={reportPolygonsBeingAdded}
            />
          )}
          {editingReportPolygons && reportPolygonBeingConstructed && (
            <PolygonEditableComponent
              polygonPoints={reportPolygonBeingConstructed}
              setPolygonPoints={setReportPolygonBeingConstructed}
              mouseLocation={mouseLatLng}
              setPointsAction={(polygon: LatLng[]) => {
                addReportPolygon(polygon);
                addMessage("Report polygon geplaatst");
              }}
            />
          )}
        </>
      ) : null}
      {/* _______________________________________________________________________________________________ END REPORT */}
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
      {(mapState.popupLatLng !== null && mapState.popupType === 'temperature') && (
        <TemperaturePopup latLng={mapState.popupLatLng!} />
      )}
      <Message text={message} visible={messageVisible} />
    </Map>
  );
};

export default connect(null, {
  mapClickWhileEditingTrees,
  setPavementBeingConstructed,
  addMessage,
  addPavement,
  addReportPolygon,
  setReportPolygonBeingConstructed,
  removeTree,
  clickTree,
  clickPavement,
  clickTemperature,
})(MainMap);
