import React, {useState} from 'react';
import { FeatureGroup,  Polyline, Polygon, Marker, Pane } from 'react-leaflet';
import L from 'leaflet';
import { getPointsWhereNewPointInLineCrossesExistingLines } from '../utils/polygonUtils';
import styles from './PolygonEditableComponent.module.css';
import { FormattedMessage } from 'react-intl.macro';
/* import { useIntl } from 'react-intl'; */

const PolygonMarkerStart = new L.Icon({
  iconUrl: require('../icons/polygonMarkerStart.svg'),
  iconRetinaUrl: require('../icons/polygonMarkerStart.svg'),
  iconSize: new L.Point(20,20),
  className: 'leaflet-div-icon'
});
const PolygonMarkerRemove = new L.Icon({
  iconUrl: require('../icons/forbiddenIcon.svg'),
  iconRetinaUrl: require('../icons/forbiddenIcon.svg'),
  iconSize: new L.Point(20,20),
  className: 'leaflet-div-icon'
});

interface Props {
  polygonPoints: L.LatLng[],
  setPolygonPoints: (latlngs: L.LatLng[]) => void,
  mouseLocation: L.LatLng,
  setPointsAction: any,
  polygonColor?: string,
  polygonColorNotAllowed?: string,
}

const PolygonEditableComponent: React.FC<Props> = (props) => {
  /* const intl = useIntl(); */
  const {
    polygonPoints,
    setPolygonPoints,
    mouseLocation,
    setPointsAction,
    polygonColor = 'blue',
    polygonColorNotAllowed = 'red',
  } = props;
  const [hoverOnMarker, setHoverOnMarker] = useState<boolean>(false);
  const newLineIntersects = getPointsWhereNewPointInLineCrossesExistingLines(
    mouseLocation,
    polygonPoints
  ).length !== 0;
  // newLineIntersectsExceptFirstLine is used when closing the polygon.
  // It checks if the closinglinepart intersects with the existing lines.
  // To calculate it the first point of the existing points is removed. The closing line will be attached to this first point.
  // Both closinglinepart and firstlinepart will depart from the first point. See illistration:
  // closinglinepart___(begin/end-point)__firstlinepart
  // first line part and last linepart can thus physically not intersect:
  // first point can thus safely be removed from the intersection check,
  // this is even required as turf library will detect that closinglinepart and firstlinepart intersect.
  const newLineIntersectsExceptFirstLine = getPointsWhereNewPointInLineCrossesExistingLines(
    mouseLocation,
    polygonPoints.slice(1) // remove first point
  ).length !== 0;
  const lastPoint = polygonPoints.slice(-1);
  const dashLinePoints = lastPoint.concat([mouseLocation]);

  /* const closePolygonTranslatedText = intl.formatMessage({
   *   id: "polygonEditableComponent.close_polygon",
   *   defaultMessage: "Complete Polygon"
   * });
   * const deleteNodePolygonTranslatedText = intl.formatMessage({
   *   id: "polygonEditableComponent.delete_node",
   *   defaultMessage: "Delete this node"
   * });
   */
  const closePolygonTranslatedText = "Sluit polygon";
  const deleteNodePolygonTranslatedText = "Verwijder dit punt";

  return (

    <FeatureGroup>
      {0 ? <FormattedMessage id="polygonEditableComponent.close_polygon" defaultMessage="Complete Polygon"/>:null}
      {0 ? <FormattedMessage id="polygonEditableComponent.delete_node" defaultMessage="Delete this node"/>:null}
      {/* // draw the polygon WITHOUT stroke.
          // By later drawing only the strokes that are already decided by the user, we create the visual effect that the polygon is open.  */}
      {polygonPoints.length > 0 && (
        <Polygon
          positions={polygonPoints}
          stroke={false}
          color={polygonColor}
        // the polygon stroke gets not correctly set back to false, therefore we need this key and verbose code:
        // when closing the polygon, but reopening it the closed border (stroke) stays.
        // this is probably a bug in react-leaflet
          key={polygonPoints + '_1'}
        />)}
      {/* // draw the stroke seperately using a polyline
          // would we have used the normal polygon to create the stroke then the unclosed polygon would have been drawn closed, we do not want that */}
      {polygonPoints.length > 0 && (
        <Polyline
          positions={[polygonPoints]}
          color={polygonColor}
        />)}

      {/* dashline for new node */}
      {
        // if the new dotted line does NOT intersect the existing line then it appears in the same color as the rest of the polygon.
        // code explained:
        // !newLineIntersects: if this dotted line DOESNOT cross the existing polygon lines
        // OR
        // (hoverOnMarker && !newLineIntersectsExceptFirstLine ):
        // if the mouse is hovering over the close marker the intention of the user is to close the polygon.
        //  this closing line can never intersect with the first linepart so we can exclude the first line part from the intersection check
        !newLineIntersects ||
        (hoverOnMarker && !newLineIntersectsExceptFirstLine)  ?

        <Polyline
          positions={dashLinePoints}
          dashArray={"8"}
          color={polygonColor}
        />
        :
        // if this dotted line CROSSES existing polygon lines, then it is shown in red to indicate this is not allowed
        <Polyline
          positions={dashLinePoints}
          dashArray={"8"}
          color={polygonColorNotAllowed}
        />
      }
      {polygonPoints.length >= 3 ?
       // The first point of the polygon wil show a marker to indicate that clicking it will close/complete the polygon.
       // This can only work if the polygon has already to or more points.

       // this Pane around the marker is needed to make the markers as high as the overlay pane in MainMap.tsx
       // without this pane the markers would not be clickabel
       <Pane
         className={styles.EditPolygonPane}
       >
         <Marker
           position={polygonPoints[0]}
         // what is exactly the type of the icon ?
         //  @ts-ignore
           icon={PolygonMarkerStart}
           onClick={() => {
             if (!newLineIntersectsExceptFirstLine) {
               setPointsAction(polygonPoints);
               setPolygonPoints([]);
             }
           }}
           onMouseOver={() => {
             setHoverOnMarker(true);
           }}
           onMouseOut={() => {
             setHoverOnMarker(false);
           }}
           title={closePolygonTranslatedText}
         />
       </Pane>
      :
       null
      }

      {/* // the last point of the polygon will show a marker on which the user can remove this last point.
          // this allows the user to repair mistakes in the polygon */}

      {/*// this Pane around the marker is needed to make the markers as high as the overlay pane in MainMap.tsx
      // without this pane the markers would not be clickabel */}
      {polygonPoints.length > 0 &&
       <Pane
         className={styles.EditPolygonPane}
       >
         <Marker
           position={polygonPoints[polygonPoints.length-1]}
         // what is exactly the type of the icon ?
         //  @ts-ignore
           icon={PolygonMarkerRemove}
           onClick={() => setPolygonPoints(polygonPoints.slice(0, -1))}
           title={deleteNodePolygonTranslatedText}
         />
       </Pane>
      }
    </FeatureGroup>
  );
      };

  export default PolygonEditableComponent;
