import { FeatureCollection, /*Geometry,*/ Feature, Polygon } from 'geojson';
import { LatLng } from 'leaflet';
import { AnyAction } from 'redux';
import { AppState } from '../App';
// import { polygonEqual } from '../utils/geometry';

import {
  START_EDITING_REPORT_POLYGON,
  CANCEL_EDITING_REPORT_POLYGON,
  SUBMIT_EDITING_REPORT_POLYGON,
  UNDO_EDITING_REPORT_POLYGON,
} from './sidebar';

export interface ReportPolygontGeojsonProperties {
  
}
const standardGeoJSonProperties:ReportPolygontGeojsonProperties = {};

export type ReportPolygonsOnMap = FeatureCollection<Polygon, ReportPolygontGeojsonProperties>;
export type ReportPolygonOnMap = Feature<Polygon, ReportPolygontGeojsonProperties>;

const EMPTY_FEATURE_COLLECTION: ReportPolygonsOnMap = {
  type: "FeatureCollection",
  features: []
};

interface ReportPolygonsState {
  reportPolygonsOnMap: ReportPolygonsOnMap,
  reportPolygonsBeingAdded: ReportPolygonsOnMap,
  reportPolygonBeingConstructed: LatLng[]
}

const INITIAL_STATE: ReportPolygonsState = {
  reportPolygonsOnMap: EMPTY_FEATURE_COLLECTION,
  reportPolygonsBeingAdded: EMPTY_FEATURE_COLLECTION,
  reportPolygonBeingConstructed: []
};

// Actions

export const SET_REPORT_POLYGON_BEING_CONSTRUCTED = 'reportPolygons/setBeingConstructed';
export const ADD_REPORT_POLYGON = 'reportPolygons/addReportPolygon';
const ADD_FEATURES_LIST = 'reportPolygons/addFeaturesList';

// export const REMOVE_PAVEMENT = 'reportPolygons/removePavement';

// Helper functions

function reportFeatureFromPolygon(polygon: LatLng[], properties: ReportPolygontGeojsonProperties): ReportPolygonOnMap {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [polygon.map((latlng) => [latlng.lng, latlng.lat])]
    },
    properties: properties
  };
}

// Reducer

const reducer = (state=INITIAL_STATE, action: AnyAction): ReportPolygonsState => {
  switch (action.type) {
    case START_EDITING_REPORT_POLYGON:
      // Should not be necessary, defensive programming
      return {
        ...state,
        reportPolygonsBeingAdded: EMPTY_FEATURE_COLLECTION,
        reportPolygonBeingConstructed: []
      };
    case CANCEL_EDITING_REPORT_POLYGON:
      return {
        ...state,
        reportPolygonsBeingAdded: EMPTY_FEATURE_COLLECTION,
        reportPolygonBeingConstructed: []
      };
    case SUBMIT_EDITING_REPORT_POLYGON:
      return {
        ...state,
        reportPolygonsOnMap: {
          ...state.reportPolygonsOnMap,
          features: [
            // ...state.reportPolygonsOnMap.features,
            ...state.reportPolygonsBeingAdded.features
          ]
        },
        reportPolygonsBeingAdded: EMPTY_FEATURE_COLLECTION,
        reportPolygonBeingConstructed: []
      };
    case UNDO_EDITING_REPORT_POLYGON:
      // If there is at least one point of a new polygon, we remove the last of those;
      // otherwise remove the last completed polygon.
      if (state.reportPolygonBeingConstructed.length > 0) {
        return {
          ...state,
          reportPolygonBeingConstructed: state.reportPolygonBeingConstructed.slice(0, -1)
        };
      } else {
        return {
          ...state,
          reportPolygonsBeingAdded: {
            ...state.reportPolygonsBeingAdded,
            features: state.reportPolygonsBeingAdded.features.slice(0, -1)
          }
        };
      }
    case SET_REPORT_POLYGON_BEING_CONSTRUCTED:
        return {
        ...state,
        reportPolygonBeingConstructed: action.latlngs
      };
    case ADD_REPORT_POLYGON: {
      const polygon: LatLng[] = action.polygon;

      return {
        ...state,
        reportPolygonsBeingAdded: {
          ...state.reportPolygonsBeingAdded,
          features: [
            ...state.reportPolygonsBeingAdded.features,
            reportFeatureFromPolygon(polygon, standardGeoJSonProperties)
          ],
        },
        reportPolygonBeingConstructed: []
      };
    }
    case ADD_FEATURES_LIST:
      const features: ReportPolygonOnMap[] = action.features;
      return {
        ...state,
        reportPolygonsOnMap: {
          ...state.reportPolygonsOnMap,
          features: [...state.reportPolygonsOnMap.features, ...features],
        },
      };
    // case REMOVE_PAVEMENT: {
    //   const geometry: Polygon = action.geometry;
    //   const pavement: Pavement = action.pavement;

    //   return {
    //     ...state,
    //     pavementsOnMap: {
    //       ...state.pavementsOnMap,
    //       features: state.pavementsOnMap.features.filter(
    //         (feature) => (
    //           feature.properties.pavement !== pavement ||
    //           !polygonEqual(feature.geometry, geometry)
    //         ))
    //     }
    //   };
    // }
    default: return state;
  };
};

export default reducer;

// Action creators

export function setReportPolygonBeingConstructed(latlngs: LatLng[]) {
  return {
    type: SET_REPORT_POLYGON_BEING_CONSTRUCTED,
    latlngs: latlngs
  };
}

export function addReportPolygon(polygon: LatLng[]) {
  return {
    type: ADD_REPORT_POLYGON,
    polygon: polygon,
  };
}

export const addReportPolygonFeaturesList = (features: ReportPolygonOnMap[]) => {
  return{
    type: ADD_FEATURES_LIST,
    features: features
  };
};

// Selectors

export function getReportPolygonsOnMap(state: AppState) {
  return state.reportPolygons.reportPolygonsOnMap;
}

export function getReportPolygonsBeingAdded(state: AppState) {
  return state.reportPolygons.reportPolygonsBeingAdded;
}

export function getReportPolygonsBeingConstructed(state: AppState) {
  return state.reportPolygons.reportPolygonBeingConstructed;
}

// export const removePavement = (
//   geometry: Geometry,
//   pavement: Pavement
// ) => {
//   return {
//     type: REMOVE_PAVEMENT,
//     geometry,
//     pavement
//   };
// };
