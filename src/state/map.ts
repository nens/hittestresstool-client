import { AnyAction } from 'redux';
import { AppState } from '../App';

interface MapState {
  width: number,
  sliderPos: number, // 0 to 1
}

const INITIAL_STATE = {
  width: 0,
  sliderPos: 0.5
}

const SET_WIDTH = 'map/setWidth';
const SET_SLIDER_POS = 'map/setSliderPos';

export default function reducer(state=INITIAL_STATE, action: AnyAction): MapState {
  switch (action.type) {
    case SET_WIDTH:
      return {...state, width: action.width};
    case SET_SLIDER_POS:
      return {...state, sliderPos: action.sliderPos};
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
  return state.sidebar.openMap === 'heatstress';
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
