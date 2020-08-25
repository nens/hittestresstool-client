import { AnyAction } from 'redux';
import { LatLng } from 'leaflet';
import { AppState, Thunk } from '../App';
import { REMOVE_TREE, TreeOnMap, TreesOnMap } from './trees';
import { REMOVE_PAVEMENT, PavementOnMap, PavementsOnMap } from './pavements';
import { wgs84ToRd } from '../utils/projection';
import { getConfiguration } from './session';

interface MapState {
  width: number; // PX; for the slider
  sliderPos: number; // 0 to 1
  templatedLayer: string | null;

  // Popup. We show at most one at a time
  popupLatLng: LatLng | null,
  popupType: "tree" | "pavement" | "temperature" | null,
  popupTree: TreeOnMap | null,
  popupPavement: PavementOnMap | null
}

const INITIAL_STATE = {
  width: 0,
  sliderPos: 0.5,
  templatedLayer: null,
  popupLatLng: null,
  popupType: null,
  popupTree: null,
  popupPavement: null
}

const SET_WIDTH = 'map/setWidth';
const SET_SLIDER_POS = 'map/setSliderPos';
export const RECEIVE_TEMPLATED_LAYER = 'map/receiveTemplatedLayer';
const CLICK_TREE = 'map/clickTree';
const CLICK_PAVEMENT = 'map/clickPavement';
const CLOSE_POPUP = 'map/closePopup';

export default function reducer(state: MapState=INITIAL_STATE, action: AnyAction): MapState {
  switch (action.type) {
    case SET_WIDTH:
      return {...state, width: action.width};
    case SET_SLIDER_POS:
      return {...state, sliderPos: action.sliderPos};
    case RECEIVE_TEMPLATED_LAYER:
      return {...state, templatedLayer: action.templatedLayer };
    case CLICK_TREE:
      return {
        ...state,
        popupLatLng: action.latlng,
        popupType: "tree",
        popupTree: action.tree,
        popupPavement: null
      };
    case CLICK_PAVEMENT:
      return {
        ...state,
        popupLatLng: action.latlng,
        popupType: "pavement",
        popupPavement: action.pavement,
        popupTree: null
      };
    case REMOVE_TREE:
    case REMOVE_PAVEMENT:
    case CLOSE_POPUP:
      // Remove popup
      return {
        ...state,
        popupLatLng: null,
        popupType: null,
        popupTree: null,
        popupPavement: null
      };
    default:
      return state;
  }
}

// Selectors

export function getMapState(state: AppState) {
  return state.map;
}

export function showSlider(state: AppState) {
  // Only show it when looking at Hittestress and there are two map
  return state.sidebar.openMap === 'heatstress' && state.map.templatedLayer !== null;
}


// Action creators

export function setMapWidth(width: number) {
  return {
    type: SET_WIDTH,
    width
  };
}

export function setSliderPos(sliderPos: number) {
  return {
    type: SET_SLIDER_POS,
    sliderPos
  };
}

function geojsonToMultipolygonWKT(pavements: PavementOnMap[]) {
  if (pavements.length === 0) {
    return undefined;
  }

  return 'MULTIPOLYGON(' + pavements.map(
    pavement => {
      // Repeat the first coordinate to close the polygon
      const coordinates = [
        ...pavement.geometry.coordinates[0],
        pavement.geometry.coordinates[0][0]
      ];

      // Rijksdriehoek!
      const rd_coords = coordinates.map(wgs84ToRd);
      return '((' + rd_coords.map(coord => coord[0] + ' ' + coord[1]).join(',') + '))'
    }
  ).join(',') + ')';
}

export const refreshHeatstress = (
  trees: TreesOnMap,
  pavements: PavementsOnMap
): Thunk => async (dispatch, getState) => {
  const configuration = getConfiguration(getState());
  if (configuration === null) return;

  const trees_5m = trees.features.filter(
    tree => tree.properties.tree === 'tree_5m'
  ).map(tree => tree.geometry.coordinates).map(wgs84ToRd);

  const trees_10m = trees.features.filter(
    tree => tree.properties.tree === 'tree_10m'
  ).map(tree => tree.geometry.coordinates).map(wgs84ToRd);

  const trees_15m = trees.features.filter(
    tree => tree.properties.tree === 'tree_15m'
  ).map(tree => tree.geometry.coordinates).map(wgs84ToRd);

  const pavementsWater = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'water')
  );
  const pavementsGrass = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'grass')
  );
  const pavementsShrub = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'shrub')
  );
  const pavementsSemipaved = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'semipaved')
  );
  const pavementsPaved = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'paved')
  );

  const parameters = {
    ProjectionTag: 'EPSG:28992',
    AnchorTag: [0, 0], // lng/lat of Rijksdriehoek 0 0
    Trees5mTag: trees_5m.length ? trees_5m : undefined,
    Trees10mTag: trees_10m.length ? trees_10m : undefined,
    Trees15mTag: trees_15m.length ? trees_15m : undefined,
    WaterTag: pavementsWater,
    GrassTag: pavementsGrass,
    ShrubTag: pavementsShrub,
    SemiPavedTag: pavementsSemipaved,
    PavedTag: pavementsPaved
  };

  const URL = `/api/v4/rasters/${configuration.templateUuid!}/template/`;

  const response = await fetch(
    URL, {
      method: 'POST',
      body: JSON.stringify({parameters}),
      headers: {'Content-Type': 'application/json'}
    }
  );

  if (response.status === 201) { // Created
    const json = await response.json();

    dispatch({
      type: RECEIVE_TEMPLATED_LAYER,
      templatedLayer: json.wms_info.layer
    });
  }
}

// Clciks for popups

export const clickTree = (latlng: LatLng, tree: TreeOnMap) => {
  return {
    type: CLICK_TREE,
    latlng,
    tree
  };
};

export const clickPavement = (latlng: LatLng, pavement: PavementOnMap) => {
  return {
    type: CLICK_PAVEMENT,
    latlng,
    pavement
  };
};

export const closePopup = () => {
  return {
    type: CLOSE_POPUP
  };
}
