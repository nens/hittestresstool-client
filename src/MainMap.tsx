import React from 'react';
import {
  Map, TileLayer
} from 'react-leaflet';

const MainMap: React.FC = () => {
  // see default public token at https://account.mapbox.com/
  const mapBoxAccesToken = "pk.eyJ1IjoibmVsZW5zY2h1dXJtYW5zIiwiYSI6ImhkXzhTdXcifQ.3k2-KAxQdyl5bILh_FioCw";

  return (
    <Map
      zoomControl={false}
      style={{height: "100%", width: "100%"}}>
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
      // why is it here zIndex and in ObjectTypeVectorGrid z-index ? however it works
        zIndex={0}
      />
    </Map>
  );
};

export default MainMap;
