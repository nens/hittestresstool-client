import { AppDispatch, AppState } from '../App';

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
  }
}

interface SessionState {
  bootstrap: Bootstrap | null
}

const INITIAL_STATE: SessionState = {
  bootstrap: null
};

const RECEIVE_BOOTSTRAP = 'session/RECEIVE_BOOTSTRAP';

interface ReceiveBootstrapAction {
  type: typeof RECEIVE_BOOTSTRAP;
  bootstrap: Bootstrap
}

// Reducer

const reducer = (state=INITIAL_STATE, action: ReceiveBootstrapAction) => {
  switch (action.type) {
    case RECEIVE_BOOTSTRAP:
      return {
        ...state,
        bootstrap: action.bootstrap
      };
    default:
      return state;
  }
};

export default reducer;

// Selectors

export const isAuthenticated = (state: AppState): boolean =>
  !!(state.session.bootstrap && state.session.bootstrap.user.authenticated)

export const getUser = (state: AppState) => (
  state.session.bootstrap && state.session.bootstrap.user);

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
