import React, { useRef } from 'react';
import Leaflet from 'leaflet';
import {
  Map, TileLayer
} from 'react-leaflet';

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


const MainMap: React.FC = () => {
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
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
      // why is it here zIndex and in ObjectTypeVectorGrid z-index ? however it works
        zIndex={0}
      />
    </Map>
  );
};

export default MainMap;
