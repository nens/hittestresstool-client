// Image slider from react-compare-image
// We overlay it on the map, to compare two transparent 1x1-pixel images
// Use the callback to set the current slider position, which the map
// can use to clip its panes.
// This way we don't need to use a library that knows about Leaflet or mapping in general.

import React from 'react';
import { connect } from 'react-redux';

import { setMapWidth, setSliderPos } from '../state/map';

import ReactCompareImage from '../components/ReactCompareImage';

interface CompareImageSliderProps {
  setMapWidth: (width: number) => void;
  setSliderPos: (pos: number) => void;
}

function CompareImageSlider(props: CompareImageSliderProps) {
  const {setMapWidth, setSliderPos} = props;
  return (
    <ReactCompareImage
      setMapWidth={setMapWidth}
      onSliderPositionChange={setSliderPos}
      sliderLineWidth={10}
      handleSize={102}
    />
  );
}

export default connect(null, {setMapWidth, setSliderPos})(CompareImageSlider);
