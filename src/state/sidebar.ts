import { AnyAction } from 'redux';
import { AppState, Thunk } from '../App';
import { RECEIVE_TEMPLATED_LAYER } from './map';
import { REMOVE_TREE } from './trees';
import { REMOVE_PAVEMENT } from './pavements';

// Sidebar state:

// Which block is open, if any
// Are we editing?
// And so on

export type Map = "heatstress" | "pavements" | "trees" | "report";

export type Tree = "tree_5m" | "tree_10m" | "tree_15m";
export const TREES: [Tree, Tree, Tree] = ["tree_5m", "tree_10m", "tree_15m"];

export type Pavement = "water" | "grass" | "shrub" | "semipaved" | "paved";

export const COLORS_PER_PAVEMENT = {
  "water": "blue",
  "grass": "lightgreen",
  "shrub": "green",
  "semipaved": "red",
  "paved": "black"
};

interface SidebarState {
  openMap: Map;
  editing: boolean;
  selectedTree: Tree;
  selectedPavement: Pavement;
  changesMade: boolean;
  heatstressUpdated: boolean;
}

const INITIAL_STATE: SidebarState = {
  openMap: "heatstress",
  editing: false,
  selectedTree: "tree_5m",
  selectedPavement: "grass",
  changesMade: false,
  heatstressUpdated: false,
};

export const CLICK_HEAT_STRESS = "sidebar/clickHeatStress";
export const CLICK_BLOCK_TREES = "sidebar/clickBlockTrees";
export const CLICK_BLOCK_PAVEMENTS = "sidebar/clickBlockPavements";
export const CLICK_REPORT = "sidebar/clickReport";
const SET_SELECTED_PAVEMENT = "sidebar/setSelectedPavement";
const SET_SELECTED_TREE = "sidebar/setSelectedTree"; 
export const START_EDITING_TREES = "sidebar/startEditingTrees";
export const CANCEL_EDITING_TREES = "sidebar/cancelEditingTrees";
export const SUBMIT_EDITING_TREES = "sidebar/submitEditingTrees";
export const UNDO_EDITING_TREES = "sidebar/undoEditingTrees";
export const START_EDITING_PAVEMENTS = "sidebar/startEditingPavements";
export const CANCEL_EDITING_PAVEMENTS = "sidebar/cancelEditingPavements";
export const SUBMIT_EDITING_PAVEMENTS = "sidebar/submitEditingPavements";
export const UNDO_EDITING_PAVEMENTS = "sidebar/undoEditingPavements";
export const START_EDITING_REPORT_POLYGON = "sidebar/startEditingReportPolygon";
export const CANCEL_EDITING_REPORT_POLYGON = "sidebar/cancelEditingReportPolygon";
export const SUBMIT_EDITING_REPORT_POLYGON = "sidebar/submitEditingReportPolygon";
export const UNDO_EDITING_REPORT_POLYGON = "sidebar/undoEditingReportPolygon";
export const SENDING_CHANGES = "sidebar/sendingChanges";

const reducer = (state=INITIAL_STATE, action: AnyAction): SidebarState => {
  const type = action.type;

  console.log("startEditingReportPolygon 3 type", type);
  switch (type) {
    case CLICK_HEAT_STRESS:
      if (state.editing || state.openMap === 'heatstress') {
        // Doesn't do anything
        return state;
      } else {
        return {
          ...state,
          openMap: "heatstress",
          heatstressUpdated: false, // Remove notification that map was updated
        };
      }
    case CLICK_BLOCK_TREES:
      if (state.editing || state.openMap === 'trees') {
        // Doesn't do anything
        return state;
      } else {
        return {...state, openMap: "trees"};
      }
    case CLICK_BLOCK_PAVEMENTS:
      if (state.editing || state.openMap === 'pavements') {
        // Doesn't do anything
        return state;
      } else {
        return {...state, openMap: "pavements"};
      }
    case CLICK_REPORT:
      if (state.editing || state.openMap === 'report') {
        // Doesn't do anything
        return state;
      } else {
        return {...state, openMap: "report"};
      }
    case SET_SELECTED_PAVEMENT:
      return {
        ...state,
        selectedPavement: action.pavement
      };
    case SET_SELECTED_TREE:
      return {
        ...state,
        selectedTree: action.tree
      };
    case START_EDITING_TREES:
    case START_EDITING_PAVEMENTS:
    case START_EDITING_REPORT_POLYGON:
      return {
        ...state,
        editing: true
      };
    case SUBMIT_EDITING_TREES:
    case SUBMIT_EDITING_PAVEMENTS:
    case SUBMIT_EDITING_REPORT_POLYGON:

      return {
        ...state,
        editing: false,
        changesMade: true
      };
    case CANCEL_EDITING_PAVEMENTS:
    case CANCEL_EDITING_TREES:
    case CANCEL_EDITING_REPORT_POLYGON:
      return {
        ...state,
        editing: false
      };
    case RECEIVE_TEMPLATED_LAYER:
      // If there is a new layer and we're not looking at the map, show that it was
      // updated.
      if (state.openMap !== 'heatstress') {
        return {
          ...state,
          heatstressUpdated: true
        }
      } else {
        return state;
      }
    case REMOVE_TREE:
    case REMOVE_PAVEMENT:
      return {
        ...state,
        changesMade: true
      };
    case SENDING_CHANGES:
      return {
        ...state,
        changesMade: false
      };
    default:
      return state;
  }
};

export default reducer;

// Selectors

export const getOpenBlock = (state: AppState): Map | null => state.sidebar.openMap;
export const getSelectedPavement = (state: AppState): Pavement => state.sidebar.selectedPavement;
export const getSelectedTree = (state: AppState): Tree => state.sidebar.selectedTree;

export const getEditingTrees = (state: AppState): boolean => (
  state.sidebar.editing && state.sidebar.openMap === 'trees'
);

export const getEditingPavements = (state: AppState): boolean => (
  state.sidebar.editing && state.sidebar.openMap === 'pavements'
);

export const getEditingReport = (state: AppState): boolean => (
  state.sidebar.editing && state.sidebar.openMap === 'report'
);

export const getEditing = (state: AppState): boolean => (
  getEditingTrees(state) || getEditingPavements(state) || getEditingReport(state)
);

export const getHeatstressUpdated = (state: AppState): boolean => {
  return state.sidebar.heatstressUpdated;
};

export const getChangesMade = (state: AppState): boolean => (
  state.sidebar.changesMade
);

export const getAnyTreesOrPavements = (state: AppState): boolean => {
  return (
    state.trees.treesOnMap.features.length > 0 ||
    state.pavements.pavementsOnMap.features.length > 0
  );
}

// Action creators

export const clickHeatStress = () => {
  return {
    type: CLICK_HEAT_STRESS
  };
};

export const clickBlockTrees = () => {
  return {
    type: CLICK_BLOCK_TREES
  };
};

export const clickBlockPavements = () => {
  return {
    type: CLICK_BLOCK_PAVEMENTS
  };
};

export const clickBlockReport = () => {
  return {
    type: CLICK_REPORT
  };
};

export const setSelectedPavement = (pavement: Pavement) => {
  return {
    type: SET_SELECTED_PAVEMENT,
    pavement
  };
}

export const setSelectedTree = (tree: Tree) => {
  return {
    type: SET_SELECTED_TREE,
    tree
  };
}

// For the following, see also trees.ts
export const startEditingTrees = () => {
  return {
    type: START_EDITING_TREES
  };
}

export const cancelEditingTrees = () => {
  return {
    type: CANCEL_EDITING_TREES
  };
}

export const submitEditingTrees = (): Thunk => (dispatch, getState) => {
  dispatch({
    type: SUBMIT_EDITING_TREES
  });
}

export const undoEditingTrees = () => {
  return {
    type: UNDO_EDITING_TREES
  };
}

// For the following, see also pavements.ts
export const startEditingPavements = () => {
  return {
    type: START_EDITING_PAVEMENTS
  };
}

export const cancelEditingPavements = () => {
  return {
    type: CANCEL_EDITING_PAVEMENTS
  };
}

export const submitEditingPavements = (): Thunk => (dispatch, getState) => {
  dispatch({
    type: SUBMIT_EDITING_PAVEMENTS
  });
}

export const undoEditingPavements = () => {
  return {
    type: UNDO_EDITING_PAVEMENTS
  };
}

// also for report polygon

export const startEditingReportPolygon = () => {
  console.log("startEditingReportPolygon 2")
  return {
    type: START_EDITING_REPORT_POLYGON
  };
}

export const cancelEditingReportPolygon = () => {
  return {
    type: CANCEL_EDITING_REPORT_POLYGON
  };
}

export const submitEditingReportPolygon = (): Thunk => (dispatch, getState) => {
  dispatch({
    type: SUBMIT_EDITING_REPORT_POLYGON
  });
}

export const undoEditingReportPolygon = () => {
  return {
    type: UNDO_EDITING_REPORT_POLYGON
  };
}

