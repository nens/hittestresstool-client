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

interface Configuration {
  mapboxAccessToken: string,
  initialBounds: {
    sw: {lat: number, lng: number},
    ne: {lat: number, lng: number}
  },
  originalHeatstressLayer: string,
  templateUuid: string,
  heatstressStyle: string
}

interface SessionState {
  bootstrap: Bootstrap | null,
  configuration: Configuration | null
}

const INITIAL_STATE: SessionState = {
  bootstrap: null,
  configuration: null
};

const RECEIVE_BOOTSTRAP = 'session/RECEIVE_BOOTSTRAP';
const RECEIVE_CONFIGURATION = 'session/RECEIVE_CONFIGURATION';

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

// Action creators

export const attemptLogin = () => async (dispatch: AppDispatch) => {
  const response = await fetch('/bootstrap/lizard/', {
    credentials: "same-origin"
  });

  if (response.status !== 200) {
    console.error("Something went wrong trying to get bootstrap: ", response);
    return;
  }

  const bootstrap: Bootstrap = await response.json();

  if (bootstrap.user.authenticated) {
    dispatch({
      type: RECEIVE_BOOTSTRAP,
      bootstrap
    });
  } else {
    window.location.href = bootstrap.sso.login + '&next=/hittestress/';
  }
};

export const fetchConfiguration = (): Thunk => async (dispatch: AppDispatch) => {
  const response = await fetch('/api/v4/clientconfigs/?slug=hittestresstool');
  const json = await response.json();

  if (json && json.count === 1) {
    const configuration: Configuration = json.results[0].clientconfig.configuration;

    dispatch({type: RECEIVE_CONFIGURATION, configuration});
  }
}
