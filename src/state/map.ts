import { AnyAction } from 'redux';
import { AppState, Thunk } from '../App';
import { TreesOnMap } from './trees';
import { PavementOnMap, PavementsOnMap } from './pavements';


interface MapState {
  width: number;
  sliderPos: number; // 0 to 1
  templatedLayer: string | null;
}

const INITIAL_STATE = {
  width: 0,
  sliderPos: 0.5,
  templatedLayer: null
}

const SET_WIDTH = 'map/setWidth';
const SET_SLIDER_POS = 'map/setSliderPos';
export const RECEIVE_TEMPLATED_LAYER = 'map/receiveTemplatedLayer';

export default function reducer(state: MapState=INITIAL_STATE, action: AnyAction): MapState {
  switch (action.type) {
    case SET_WIDTH:
      return {...state, width: action.width};
    case SET_SLIDER_POS:
      return {...state, sliderPos: action.sliderPos};
    case RECEIVE_TEMPLATED_LAYER:
      return {...state, templatedLayer: action.templatedLayer };
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

      return '((' + coordinates.map(coord => coord[0] + ' ' + coord[1]).join(',') + '))'
    }
  ).join(',') + ')';
}

export const refreshHeatstress = (
  trees: TreesOnMap,
  pavements: PavementsOnMap
): Thunk => async (dispatch) => {
  const trees_5m = trees.features.filter(
    tree => tree.properties.tree === 'tree_5m'
  ).map(tree => tree.geometry.coordinates);

  const trees_10m = trees.features.filter(
    tree => tree.properties.tree === 'tree_10m'
  ).map(tree => tree.geometry.coordinates);

  const trees_15m = trees.features.filter(
    tree => tree.properties.tree === 'tree_15m'
  ).map(tree => tree.geometry.coordinates);

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

  const URL = '/api/v4/rasters/620b825c-090a-4d32-a17b-bf29e3e28830/template/';

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
