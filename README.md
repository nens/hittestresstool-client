# Hittestresstool

The "Hittestresstool" (heat stress tool) is a Lizard frontend
application for viewing and editing heat stress models and showing
them on the map.

It is found at e.g. https://demo.lizard.net/hittestresstool/ , or
https://nxt3.staging.lizard.net/hittestresstool/ ; it is only
accessible for users of the right Organisation ("Hittestress demo" for
that production site, "Geoblocks demo" on staging).

## Functionality overview

The Hittestresskaart is a Geoblock, a dynamically computed raster.

It can be dynamically changed by either
- Placing trees of various sizes (5m, 10m, 15m) or
- Placing polygons that belong to one of five surface types ("pavements")

After placing these, the new map can be visualised, and they can be
compared using a *comparison slider*.

Also, clicking on the map can show a popup with both the original
temperature and the temperature in the edited situation.

When editing trees, the underlying trees raster is shown; when editing
pavements the underlying land use raster is shown. This is a bit of
improvisation as the design wasn't very clear and could well be
changed later.

## Configuration

Hittestresstool uses the **new** ClientConfig model, the first app to
use it.

The idea is that the ClientConfig is owned by the Organisation that
the particular instance of the Hittestresstool is for, and that its
access modifier is set to **Private**, so that only members can see
it.

Hittestresstool then gets all configs it has access to at
/api/v4/clientconfigs/?slug=hittestresstool , *and it must get only
one result*. People cannot have access to multiple instances of the tool.

This way, multiple configurations can exist at the same URL (currently
all customers are at https://nens.lizard.net/hittestresstool/).

The Type of the expected JSON is currently as follows (see src/state/session.ts):

```
interface Bounds {
  sw: {lat: number, lng: number},
  ne: {lat: number, lng: number}
}

interface Configuration {
  mapboxAccessToken: string,
  initialBounds: Bounds,
  maxBounds?: Bounds,
  minZoom?: number,
  originalHeatstressLayer: string,
  originalTreesLayer: string,
  originalPavementsLayer: string,
  templateUuid: string,
  heatstressStyle: string,
  treesStyle: string,
  pavementsStyle: string
}
```

The Mapbox access token is stored in the configuration so it does not
have to be in the source repository; client configs are Private so
this is protected against people who don't need it.

The layers and styles are used for the three background WMS layers;
templateUuid is the template Geoblock that the app is about.

If maxBounds is not given, initialBounds is used as maxBounds.

## Technical design

### Our typical app layout

### Template Geoblock

### Comparison slider

## Directory structure

## Storybook

## Proxying for development

## Release and deployment

### Release

### Deployment

## Problems

### No translations

### Point request for popups

### Still no testing

## Future features
