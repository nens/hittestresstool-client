// API calls

import { LatLng } from 'leaflet';

export async function fetchValueAtPoint(rasterUuid: string, latLng: LatLng) {
  // Note we do not use use /point/ because it gives no results on production
  // right now, probably some problem with Geoblocks
  // This linestring is more or less the same thing.
  const { lat, lng } = latLng;

  const lat2 = lat + 0.00001;
  const lng2 = lng + 0.00001;

  const response = await fetch(
    `/api/v4/rasters/${rasterUuid}/line/?geom=LINESTRING+(${lng}+${lat},+${lng2}+${lat2})`
  );

  if (response.status !== 200) return null;

  const data = await response.json();

  if (data && data.results && data.results.length) {
    return data.results[0][1] as number;
  } else {
    return null;
  }
}
