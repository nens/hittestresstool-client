import { AnyAction } from 'redux';
import { AppState } from '../App';

// Sidebar state:

// Which block is open, if any
// Are we editing?
// And so on

export type Map = "heatstress" | "pavements" | "trees";

export type Tree = "tree_5m" | "tree_10m" | "tree_15m";

export type Pavement = "water" | "grass" | "shrub" | "semipaved" | "paved";

interface SidebarState {
  openMap: Map;
  editing: boolean;
  selectedTree: Tree;
  selectedPavement: Pavement;
}

const INITIAL_STATE: SidebarState = {
  openMap: "heatstress",
  editing: false,
  selectedTree: "tree_5m",
  selectedPavement: "grass",
};

const CLICK_HEAT_STRESS = "sidebar/clickHeatStress";
const CLICK_BLOCK_TREES = "sidebar/clickBlockTrees";
const CLICK_BLOCK_PAVEMENTS = "sidebar/clickBlockPavements";
const SET_SELECTED_PAVEMENT = "sidebar/setSelectedPavement";

const reducer = (state=INITIAL_STATE, action: AnyAction): SidebarState => {
  const type = action.type;

  switch (type) {
    case CLICK_HEAT_STRESS:
      if (state.editing || state.openMap === 'heatstress') {
        // Doesn't do anything
        return state;
      } else {
        return {...state, openMap: "heatstress"};
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
    case SET_SELECTED_PAVEMENT:
      return {
        ...state,
        selectedPavement: action.pavement
      };
    default:
      return state;
  }
};

export default reducer;

// Selectors

export const getOpenBlock = (state: AppState): Map | null => state.sidebar.openMap;
export const getSelectedPavement = (state: AppState): Pavement => state.sidebar.selectedPavement;

export const getEditingTrees = (state: AppState): boolean => (
  state.sidebar.editing && state.sidebar.openMap === 'trees'
);

export const getEditingPavements = (state: AppState): boolean => (
  state.sidebar.editing && state.sidebar.openMap === 'pavements'
);

export const getEditing = (state: AppState): boolean => (
  getEditingTrees(state) || getEditingPavements(state)
);

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

export const setSelectedPavement = (pavement: Pavement) => {
  return {
    type: SET_SELECTED_PAVEMENT,
    pavement
  };
}
