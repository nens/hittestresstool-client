// API calls

import { LatLng } from 'leaflet';

const EPS = 0.00001;

export async function fetchValueAtPoint(rasterUuid: string, latLng: LatLng) {
  // Note we do not use use /point/ because it gives no results on production
  // right now, probably some problem with Geoblocks
  // This linestring is more or less the same thing.
  const { lat, lng } = latLng;

  const lng1 = lng - EPS;
  const lng2 = lng + EPS;
  const lat1 = lat - EPS;
  const lat2 = lat + EPS;

  const polygon = `((${lng1} ${lat1},${lng2} ${lat1},${lng2} ${lat2},${lng1} ${lat2},${lng1} ${lat1}))`;

  const url = `/api/v4/rasters/${rasterUuid}/zonal/?geom=POLYGON+${polygon}&zonal_statistic=max&zonal_projection=EPSG:28992&pixel_size=0.5`;

  const response = await fetch(url);

  if (response.status !== 200) return null;

  const data = await response.json();

  if (data && data.results && data.results.length) {
    return data.results[0].value as number;
  } else {
    return null;
  }
}
