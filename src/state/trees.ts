import { FeatureCollection, Feature, Point } from 'geojson';
import { AnyAction } from 'redux';
import { LatLng } from 'leaflet';
import { AppState, Thunk } from '../App';

import {
  Tree,
  getSelectedTree,
  START_EDITING_TREES,
  CANCEL_EDITING_TREES,
  SUBMIT_EDITING_TREES,
  UNDO_EDITING_TREES,
} from './sidebar';

interface TreeGeojsonProperties {
  tree: Tree
}
export type TreesOnMap = FeatureCollection<Point, TreeGeojsonProperties>;
export type TreeOnMap = Feature<Point, TreeGeojsonProperties>;

const EMPTY_FEATURE_COLLECTION: TreesOnMap = {
  type: "FeatureCollection",
  features: []
};


interface TreesState {
  treesOnMap: TreesOnMap,
  treesBeingAdded: TreesOnMap
}

const INITIAL_STATE: TreesState = {
  treesOnMap: EMPTY_FEATURE_COLLECTION,
  treesBeingAdded: EMPTY_FEATURE_COLLECTION,
};

const ADD_TREE = 'trees/addTree';

export function latLng2Feature(latlng: LatLng, tree: Tree): TreeOnMap {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [latlng.lng, latlng.lat]
    },
    properties: {
      tree: tree
    }
  }
}

const reducer = (state=INITIAL_STATE, action: AnyAction): TreesState => {
  const type = action.type;

  switch (type) {
    case START_EDITING_TREES:
      // Should not be necessary, defensive programming
      return {
        ...state,
        treesBeingAdded: EMPTY_FEATURE_COLLECTION,
      };
    case CANCEL_EDITING_TREES:
      return {
        ...state,
        treesBeingAdded: EMPTY_FEATURE_COLLECTION,
      };
    case SUBMIT_EDITING_TREES:
      return {
        ...state,
        treesOnMap: {
          ...state.treesOnMap,
          features: [...state.treesOnMap.features, ...state.treesBeingAdded.features],
        },
        treesBeingAdded: EMPTY_FEATURE_COLLECTION,
      };
    case UNDO_EDITING_TREES:
      // Remove last tree added
      if (state.treesBeingAdded.features.length > 0) {
        const newFeatures = [...state.treesBeingAdded.features];
        newFeatures.pop();
        return {
          ...state,
          treesBeingAdded: {
            ...state.treesBeingAdded,
            features: newFeatures
          }
        };
      } else {
        // No action
        return state;
      }
    case ADD_TREE:
      const latlng: LatLng = action.latlng;
      const tree: Tree = action.tree;
      return {
        ...state,
        treesBeingAdded: {
          ...state.treesBeingAdded,
          features: [...state.treesBeingAdded.features, latLng2Feature(latlng, tree)]
        }
      };
    default:
      return state;
  }
};

export default reducer;

// Selectors

export const getTreesOnMap = (state: AppState) => state.trees.treesOnMap;
export const getTreesBeingAdded = (state: AppState) => state.trees.treesBeingAdded;

// Action creators

export const mapClickWhileEditingTrees = (latlng: LatLng): Thunk => (dispatch, getState) => {
  const state = getState();
  const selectedTree = getSelectedTree(state);

  dispatch({
    type: ADD_TREE,
    latlng: latlng,
    tree: selectedTree
  });
};
