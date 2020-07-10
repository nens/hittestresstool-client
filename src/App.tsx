import React from 'react';
import { Provider, useSelector } from "react-redux";
import { combineReducers, createStore, compose, AnyAction, applyMiddleware } from 'redux';
import thunk, { ThunkDispatch, ThunkAction } from 'redux-thunk';
import {
  IntlProvider
} from 'react-intl';
import translations from './i18n/locales';

import * as reducers from './state/';
import { getLocaleStringFromBrowserSetting } from './utils/detectLanguage';
import { isAuthenticated } from './state/session';
import AttemptLogin from './screens/AttemptLogin';

import './App.css';


const rootReducer = combineReducers(reducers);
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    (
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
    // Add compose here so it doesnot crash when redux devtools not present  https://github.com/zalmoxisus/redux-devtools-extension/issues/320
    || compose)
);

export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = () => AppState;
export type AppDispatch = ThunkDispatch<AppState, undefined, AnyAction>;
export type Thunk = ThunkAction<void, AppState, undefined, AnyAction>;
export const appDispatch = store.dispatch;

const App: React.FC = () => {
  const localeProp = getLocaleStringFromBrowserSetting();

  return (
    <IntlProvider
      locale={localeProp}
      defaultLocale="en"
      key={localeProp}
      //  @ts-ignore
      messages={translations[localeProp]}
    >
      <Provider store={store}>
        <AppWithAuthentication/>
      </Provider>
    </IntlProvider>
  );
};


const AppWithAuthentication: React.FC = () => {
  // Choose which main component to render based on the app flow
  const authenticated = useSelector(isAuthenticated);

  return (
    <div>
      {authenticated ? <p>Hoi</p> : <AttemptLogin/>}
    </div>
  );
};

export default App;
