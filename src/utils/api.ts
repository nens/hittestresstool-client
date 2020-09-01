// API calls

import { LatLng } from 'leaflet';

export async function fetchValueAtPoint(rasterUuid: string, latLng: LatLng) {
  const { lat, lng } = latLng;

  const response = await fetch(
    `/api/v4/rasters/${rasterUuid}/point/?geom=POINT+(${lng}+${lat})`
  );

  if (response.status !== 200) return null;

  const data = await response.json();

  if (data && data.results && data.results.length) {
    return data.results[0][1] as number;
  } else {
    return null;
  }
}
