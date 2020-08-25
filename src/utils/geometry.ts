import {Geometry, Point, Polygon} from 'geojson';

export function geometryEqual(geom1: Geometry, geom2: Geometry) {
  if (geom1.type === 'Point' && geom2.type === 'Point') return pointEqual(geom1, geom2);
  if (geom1.type === 'Polygon' && geom2.type === 'Polygon') return polygonEqual(geom1, geom2);
  return false;
}

export function pointEqual(geom1: Point, geom2: Point) {
  const coords1 = geom1.coordinates;
  const coords2 = geom2.coordinates;

  return (coords1.length === coords2.length &&
          coords1.every((c, idx) => c === coords2[idx]));
}

export function polygonEqual(geom1: Polygon, geom2: Polygon) {
  const coords1 = geom1.coordinates;
  const coords2 = geom2.coordinates;

  return JSON.stringify(coords1) === JSON.stringify(coords2); // Why not
}
