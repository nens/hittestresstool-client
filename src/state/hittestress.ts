// Here we actually make a new Geoblock, and keep info about its UUIDs and so on

import { TreesOnMap } from './trees';
import { PavementOnMap, PavementsOnMap } from './pavements';

function geojsonToMultipolygonWKT(pavements: PavementOnMap[]) {
  if (pavements.length === 0) {
    return undefined;
  }

  return 'MULTIPOLYGON(' + pavements.map(
    pavement => {
      // Repeat the first coordinate to close the polygon
      const coordinates = [
        ...pavement.geometry.coordinates[0],
        pavement.geometry.coordinates[0][0]
      ];

      return '((' + coordinates.map(coord => coord[0] + ' ' + coord[1]).join(',') + '))'
    }
  ).join(',') + ')';
}

export async function refreshHeatstress(
  trees: TreesOnMap,
  pavements: PavementsOnMap
) {
  const trees_5m = trees.features.filter(
    tree => tree.properties.tree === 'tree_5m'
  ).map(tree => tree.geometry.coordinates);

  const trees_10m = trees.features.filter(
    tree => tree.properties.tree === 'tree_10m'
  ).map(tree => tree.geometry.coordinates);

  const trees_15m = trees.features.filter(
    tree => tree.properties.tree === 'tree_15m'
  ).map(tree => tree.geometry.coordinates);

  const pavementsWater = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'water')
  );
  const pavementsGrass = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'grass')
  );
  const pavementsShrub = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'shrub')
  );
  const pavementsSemipaved = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'semipaved')
  );
  const pavementsPaved = geojsonToMultipolygonWKT(
    pavements.features.filter(pavement => pavement.properties.pavement === 'paved')
  );

  const parameters = {
    ProjectionTag: 'WGS84',
    AnchorTag: [3.313558, 47.974767], // lng/lat of Rijksdriehoek 0 0
    Trees5mTag: trees_5m.length ? trees_5m : undefined,
    Trees10mTag: trees_10m.length ? trees_10m : undefined,
    Trees15mTag: trees_15m.length ? trees_15m : undefined,
    WaterTag: pavementsWater,
    GrassTag: pavementsGrass,
    ShrubTag: pavementsShrub,
    SemiPavedTag: pavementsSemipaved,
    PavedTag: pavementsPaved
  };

  console.log(parameters);

  const URL = '/api/v4/rasters/620b825c-090a-4d32-a17b-bf29e3e28830/template/';

  const response = await fetch(
    URL, {
      method: 'POST',
      body: JSON.stringify({parameters}),
      headers: {'Content-Type': 'application/json'}
    }
  );

  console.log(response);
}
