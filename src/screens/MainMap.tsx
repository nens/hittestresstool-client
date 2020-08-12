import React, { useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import Leaflet, { LatLng } from 'leaflet';
import {
  Map, TileLayer, WMSTileLayer, GeoJSON
} from 'react-leaflet';

import {
  getOpenBlock,
  getEditing
} from '../state/sidebar';
import {
  mapClickWhileEditingTrees,
  getTreesOnMap,
  getTreesBeingAdded
} from '../state/trees';
import TreeMarker from '../icons/TreeLeafletIcon';

// Since we haven't quite decided at which bounds a given user should start,
// and I'm interested how hot this bedroom I'm working from home in will become,
// let's use it as a temporary default.
const BOUNDS = Leaflet.latLngBounds(Leaflet.latLng({
  "lat": 51.93505786978855,
  "lng": 5.8016395568847665
}), Leaflet.latLng({
  "lat": 52.03887098970015,
  "lng": 6.041107177734376
}));


interface MainMapProps {
  mapClickWhileEditingTrees: (latlng: LatLng) => void
}

const MainMap: React.FC<MainMapProps> = ({mapClickWhileEditingTrees}) => {
  const openBlock = useSelector(getOpenBlock);
  const editing = useSelector(getEditing);
  const treesOnMap = useSelector(getTreesOnMap);
  const treesBeingAdded = useSelector(getTreesBeingAdded);

  console.log(treesBeingAdded);

  // see default public token at https://account.mapbox.com/
  const mapBoxAccesToken = "pk.eyJ1IjoibmVsZW5zY2h1dXJtYW5zIiwiYSI6ImhkXzhTdXcifQ.3k2-KAxQdyl5bILh_FioCw";
  const mapRef = useRef(null);

  return (
    <Map
      ref={mapRef}
      zoomControl={false}
      style={{height: "100%", width: "100%"}}
      bounds={BOUNDS}
      onMoveEnd={(_dummy: any) => {
        if (mapRef) {
          // @ts-ignore: for some reason TS keeps thinking mapRef can be null
          console.log(mapRef!.current!.leafletElement!.getBounds());
        }}}
      onClick={(event: any) => {
        const latlng: LatLng = event.latlng;

        if (editing) {
          if (openBlock === 'trees') {
            mapClickWhileEditingTrees(latlng);
          }
        }
      }}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
        zIndex={0}
      />
      {openBlock === 'heatstress' ? (
        <WMSTileLayer
          url="https://nxt3.staging.lizard.net/wms/"
          layers="nelen-schuurmans:interactive-heat-stress-model"
        />
      ) : null}
      {openBlock === 'trees' ? (
        <>
          {/* <WMSTileLayer
              url="https://nxt3.staging.lizard.net/wms/"
              layers="nelen-schuurmans:treescmheight-interactive-heat-stress-cp20rxms"
              /> */}
          <GeoJSON
            key={"treesOnMap" + treesOnMap.features.length + editing}
            data={treesOnMap}
            pointToLayer={TreeMarker(editing)}
          />
          <GeoJSON
            key={"treesBeingAdded" + treesBeingAdded.features.length}
            data={treesBeingAdded}
            pointToLayer={TreeMarker()}
          />
        </>
      ) : null}
      {openBlock === 'pavements' ? (
        <WMSTileLayer
          url="https://nxt3.staging.lizard.net/wms/"
          layers="nelen-schuurmans:landuse-interactive-heat-stress-tm76ldn4"
        />
      ) : null}
    </Map>
  );
};

export default connect(null, {
  mapClickWhileEditingTrees
})(MainMap);
