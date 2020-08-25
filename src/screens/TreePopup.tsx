import React from 'react';
import { connect } from 'react-redux';
import Leaflet from 'leaflet';
import { Geometry } from 'geojson';

import Popup from '../components/Popup';
import TextButton from '../components/TextButton';

import { Tree } from '../state/sidebar';
import { closePopup } from '../state/map';
import { TreeOnMap, removeTree } from '../state/trees';

interface TreePopupProps {
  latLng: Leaflet.LatLng;
  tree: TreeOnMap;
  removeTree: (geom: Geometry, tree: Tree) => void;
  closePopup: () => void;
}

function TreeMarker(props: TreePopupProps) {
  const {
    latLng,
    tree,
    removeTree,
    closePopup
  } = props;

  return (
    <Popup latLng={latLng} onClose={closePopup}>
      <h2>{
        tree.properties.tree === 'tree_5m' ? "Boom 5m" :
        tree.properties.tree === 'tree_10m' ? "Boom 10m" :
        tree.properties.tree === 'tree_15m' ? "Boom 15m" :
        "Onbekende boom"
      }</h2>
      <TextButton
        text={"Verwijder"}
        onClick={() => removeTree(tree.geometry, tree.properties.tree)}
      />
    </Popup>
  );
}

export default connect(null, {
  removeTree,
  closePopup
})(TreeMarker);
