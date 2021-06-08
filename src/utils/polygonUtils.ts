import { Feature, LineString, Position } from '@turf/turf';
import lineIntersect from '@turf/line-intersect';

import { LatLng } from 'leaflet';

// The Following function uses the turf library to calculate if lines intersect
// It takes an array of old points and a seperate new point and returns an array of points where the new point caused intersections with the old points.
/*
   For example in below illistration
   when 1 2 and 3 are coordinates of existing points
   and 4 is the coordinate of a new points
   calling "getPointsWhereNewPointInLineCrossesExistingLines ( 4, [1,2,3]) " will return the: [coordinates_of_X]


   4 (new point)
   \
   \
   1_____________X_______2
   \     /
   \   /
   \ /
   3

 */

function pointsToLineString(coordinates: Position[]): Feature<LineString> {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates
    },
    properties: {}
  };
}

export const getPointsWhereNewPointInLineCrossesExistingLines = (
  newPoint: LatLng,
  existingPoints: LatLng[]
) => {
  const len = existingPoints.length;
  if (len <= 2) return []; // Can't intersect

  // convert parameters to format that turf library understands
  const existingCoordinatesInTurfFormat = existingPoints.map(latLng=>[latLng.lng,latLng.lat]);
  const newCoordinateInTurfFormat = [newPoint.lng, newPoint.lat];

  // if there are not at least 3 existing points a new point (less then 4th points) cannot cause intersections yet.
  // following represents a line between nodes 1 and 2 and 3:
  // 1__2__3
  // lines between 1_and_2 and 2_and_3 cannot intersect because they depart from a common point 2
  // get the existing line minus the last point.
  // since the last line part of the existing points and the new linepart depart from a common point (namely the last point of the existing points) they cannot intersect
  // we need to remove them because turf sees that the new line part starts where the old line ends and sees this as a intersection, but for our purposes it is not
  // remove last point of existing points
  // get the new line part from: the last point of the existing line + the new point
  const newLine = pointsToLineString([
    existingCoordinatesInTurfFormat[len - 1],
    newCoordinateInTurfFormat
  ]);
  const existingLine = pointsToLineString(existingCoordinatesInTurfFormat.slice(0, -1));
  // use turf to calculate the intersections between the newline and the existing line
  const intersection = lineIntersect(existingLine, newLine);
  // return the array of features which contain the intersections as returned by turf's lineIntersect function
  return intersection.features;
}
