import proj4 from 'proj4';

const RD = 'PROJCS["Amersfoort / RD New", GEOGCS["Amersfoort", DATUM["Amersfoort", SPHEROID["Bessel 1841",6377397.155,299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725], AUTHORITY["EPSG","6289"]], PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4289"]],PROJECTION["Oblique_Stereographic"],PARAMETER["latitude_of_origin",52.15616055555555],PARAMETER["central_meridian",5.38763888888889],PARAMETER["scale_factor",0.9999079],PARAMETER["false_easting",155000],PARAMETER["false_northing",463000], UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST], AXIS["Y",NORTH],AUTHORITY["EPSG","28992"]]';

proj4.defs('EPSG:28992', RD);

export function wgs84ToRd(coord: number[]) {
  return proj4('WGS84', 'EPSG:28992', coord);
}
