import { AnyAction } from 'redux';
import { AppDispatch, AppState, Thunk } from '../App';

// Types and actions

// Bootstrap interface defines those fields we actually use
interface Bootstrap {
  user: {
    authenticated: boolean,
    username: string,
    first_name: string
  },
  sso: {
    login: string,
    logout: string
  },
}

interface Bounds {
  sw: {lat: number, lng: number},
  ne: {lat: number, lng: number}
}

interface Configuration {
  mapboxAccessToken: string,
  initialBounds: Bounds,
  maxBounds?: Bounds,
  minZoom?: number,
  originalHeatstressLayer: string,
  originalTreesLayer: string,
  originalPavementsLayer: string,
  templateUuid: string,
  heatstressStyle: string,
  treesStyle: string,
  pavementsStyle: string
}

export interface LegendStep {
  value: number;
  color: string;
}

interface SessionState {
  bootstrap: Bootstrap | null;
  configuration: Configuration | null;
  startupErrors: string[];
  steps: LegendStep[] | null;
  differenceSteps: LegendStep[] | null;
}

const INITIAL_STATE: SessionState = {
  bootstrap: null,
  configuration: null,
  startupErrors: [],
  steps: null,
  differenceSteps: null,
};

const RECEIVE_BOOTSTRAP = 'session/RECEIVE_BOOTSTRAP';
const RECEIVE_CONFIGURATION = 'session/RECEIVE_CONFIGURATION';
const ADD_ERROR = 'session/ADD_ERROR';
const SET_LEGEND_STEPS = 'session/SET_LEGEND_STEPS';
const SET_DIFFERENCE_LEGEND_STEPS = 'session/SET_DIFFERENCE_LEGEND_STEPS';

// Reducer

const reducer = (state=INITIAL_STATE, action: AnyAction): SessionState => {
  switch (action.type) {
    case RECEIVE_BOOTSTRAP:
      return {
        ...state,
        bootstrap: action.bootstrap
      };
    case RECEIVE_CONFIGURATION:
      return {
        ...state,
        configuration: action.configuration
      };
    case ADD_ERROR:
      return {
        ...state,
        startupErrors: [...state.startupErrors, action.error]
      }
    case SET_LEGEND_STEPS:
      return {
        ...state,
        steps: action.steps
      };
    case SET_DIFFERENCE_LEGEND_STEPS:
      return {
        ...state,
        differenceSteps: action.steps
      };
    default:
      return state;
  }
};

export default reducer;

// Selectors

export const appReady = (state: AppState): boolean => {
  return (
    !!(state.session.bootstrap && state.session.bootstrap.user.authenticated)) &&
         (!!(state.session.configuration));

};

export const getUser = (state: AppState) => (
  state.session.bootstrap && state.session.bootstrap.user);

export const getConfiguration = (state: AppState) => state.session.configuration;

export const getErrors = (state: AppState) => state.session.startupErrors;

export const getLegendSteps = (state: AppState) => state.session.steps;
export const getDifferenceLegendSteps = (state: AppState) => state.session.differenceSteps;

// Action creators

export const attemptLogin = () => async (dispatch: AppDispatch) => {
  const response = await fetch('/bootstrap/lizard/', {
    credentials: "same-origin"
  });

  if (response.status !== 200) {
    dispatch(addError("Kan niet inloggen op de Hittestresstool: Bootstrap response status " + response.status + "."));
    return;
  }

  const bootstrap: Bootstrap = await response.json();

  if (bootstrap.user.authenticated) {
    dispatch({
      type: RECEIVE_BOOTSTRAP,
      bootstrap
    });
  } else {
    window.location.href = bootstrap.sso.login + '&next=/hittestresstool/';
  }
};

export const fetchConfiguration = (): Thunk => async (dispatch: AppDispatch) => {
  const response = await fetch('/api/v4/clientconfigs/?slug=hittestresstool');

  if (response.status !== 200) {
    dispatch(addError("Fout bij ophalen Hittestresstool configuratie, status " + response.status + "."));
    return;
  }

  const json = await response.json();

  if (!json) {
    dispatch(addError("Fout bij ophalen Hittestresstool configuratie, response was geen JSON. "));
  } else if (json.count === 1) {
    const configuration: Configuration = json.results[0].clientconfig.configuration;

    dispatch({type: RECEIVE_CONFIGURATION, configuration});
    dispatch(fetchLegend(configuration.heatstressStyle));
    dispatch(fetchDifferenceLegend("pet_difference:-5:5"));
  } else {
    dispatch(addError("Fout bij ophalen Hittestresstool configuratie, " + json.count + " configuraties gevonden."));
  }
};

const addError = (error: string) => {
  return {
    type: ADD_ERROR,
    error
  };
};

// Fetch legend

export const fetchLegend = (style: string): Thunk => (dispatch) => {
  fetch(`/wms/?service=WMS&request=GetLegend&style=${style}&steps=65&format=json`).then(
    (response) => response.json()).then(
      (json) => {
        const steps = json.legend as LegendStep[];
        steps.reverse();
        dispatch({type: SET_LEGEND_STEPS, steps});
      });
};

export const fetchDifferenceLegend = (style: string): Thunk => (dispatch) => {
  fetch(`/wms/?service=WMS&request=GetLegend&style=${style}&steps=65&format=json`).then(
    (response) => response.json()).then(
      (json) => {
        const steps = json.legend as LegendStep[];
        steps.reverse();
        dispatch({type: SET_DIFFERENCE_LEGEND_STEPS, steps});
      });
};
