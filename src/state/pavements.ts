import { FeatureCollection, Geometry, Feature, Polygon } from 'geojson';
import { LatLng } from 'leaflet';
import { AnyAction } from 'redux';
import { AppState } from '../App';
import { polygonEqual } from '../utils/geometry';

import {
  Pavement,
  START_EDITING_PAVEMENTS,
  CANCEL_EDITING_PAVEMENTS,
  SUBMIT_EDITING_PAVEMENTS,
  UNDO_EDITING_PAVEMENTS,
} from './sidebar';

interface PavementGeojsonProperties {
  pavement: Pavement
}
export type PavementsOnMap = FeatureCollection<Polygon, PavementGeojsonProperties>;
export type PavementOnMap = Feature<Polygon, PavementGeojsonProperties>;

const EMPTY_FEATURE_COLLECTION: PavementsOnMap = {
  type: "FeatureCollection",
  features: []
};

interface PavementsState {
  pavementsOnMap: PavementsOnMap,
  pavementsBeingAdded: PavementsOnMap,
  pavementBeingConstructed: LatLng[]
}

const INITIAL_STATE: PavementsState = {
  pavementsOnMap: EMPTY_FEATURE_COLLECTION,
  pavementsBeingAdded: EMPTY_FEATURE_COLLECTION,
  pavementBeingConstructed: []
};

// Actions

export const SET_PAVEMENT_BEING_CONSTRUCTED = 'pavements/setBeingConstructed';
export const ADD_PAVEMENT = 'pavements/addPavement';
export const REMOVE_PAVEMENT = 'pavements/removePavement';

// Helper functions

function pavementFromPolygon(polygon: LatLng[], pavement: Pavement): PavementOnMap {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [polygon.map((latlng) => [latlng.lng, latlng.lat])]
    },
    properties: {pavement}
  };
}

// Reducer

const reducer = (state=INITIAL_STATE, action: AnyAction): PavementsState => {
  switch (action.type) {
    case START_EDITING_PAVEMENTS:
      // Should not be necessary, defensive programming
      return {
        ...state,
        pavementsBeingAdded: EMPTY_FEATURE_COLLECTION,
        pavementBeingConstructed: []
      };
    case CANCEL_EDITING_PAVEMENTS:
      return {
        ...state,
        pavementsBeingAdded: EMPTY_FEATURE_COLLECTION,
        pavementBeingConstructed: []
      };
    case SUBMIT_EDITING_PAVEMENTS:
      return {
        ...state,
        pavementsOnMap: {
          ...state.pavementsOnMap,
          features: [
            ...state.pavementsOnMap.features,
            ...state.pavementsBeingAdded.features
          ]
        },
        pavementsBeingAdded: EMPTY_FEATURE_COLLECTION,
        pavementBeingConstructed: []
      };
    case UNDO_EDITING_PAVEMENTS:
      // If there is at least one point of a new polygon, we remove the last of those;
      // otherwise remove the last completed polygon.
      if (state.pavementBeingConstructed.length > 0) {
        return {
          ...state,
          pavementBeingConstructed: state.pavementBeingConstructed.slice(0, -1)
        };
      } else {
        return {
          ...state,
          pavementsBeingAdded: {
            ...state.pavementsBeingAdded,
            features: state.pavementsBeingAdded.features.slice(0, -1)
          }
        };
      }
    case SET_PAVEMENT_BEING_CONSTRUCTED:
        return {
        ...state,
        pavementBeingConstructed: action.latlngs
      };
    case ADD_PAVEMENT: {
      const polygon: LatLng[] = action.polygon;
      const pavement: Pavement = action.pavement;

      return {
        ...state,
        pavementsBeingAdded: {
          ...state.pavementsBeingAdded,
          features: [
            ...state.pavementsBeingAdded.features,
            pavementFromPolygon(polygon, pavement)
          ],
        },
        pavementBeingConstructed: []
      };
    }
    case REMOVE_PAVEMENT: {
      const geometry: Polygon = action.geometry;
      const pavement: Pavement = action.pavement;

      return {
        ...state,
        pavementsOnMap: {
          ...state.pavementsOnMap,
          features: state.pavementsOnMap.features.filter(
            (feature) => (
              feature.properties.pavement !== pavement ||
              !polygonEqual(feature.geometry, geometry)
            ))
        }
      };
    }
    default: return state;
  };
};

export default reducer;

// Action creators

export function setPavementBeingConstructed(latlngs: LatLng[]) {
  return {
    type: SET_PAVEMENT_BEING_CONSTRUCTED,
    latlngs: latlngs
  };
}

export function addPavement(polygon: LatLng[], pavement: Pavement) {
  return {
    type: ADD_PAVEMENT,
    polygon: polygon,
    pavement: pavement
  };
}

// Selectors

export function getPavementsOnMap(state: AppState) {
  return state.pavements.pavementsOnMap;
}

export function getPavementsBeingAdded(state: AppState) {
  return state.pavements.pavementsBeingAdded;
}

export function getPavementBeingConstructed(state: AppState) {
  return state.pavements.pavementBeingConstructed;
}

export const removePavement = (
  geometry: Geometry,
  pavement: Pavement
) => {
  return {
    type: REMOVE_PAVEMENT,
    geometry,
    pavement
  };
};
