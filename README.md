# Hittestresstool

The "Hittestresstool" (heat stress tool) is a Lizard frontend
application for viewing and editing heat stress models and showing
them on the map.

It is found at e.g. https://demo.lizard.net/hittestresstool/ , or
https://nxt3.staging.lizard.net/hittestresstool/ ; it is only
accessible for users of the right Organisation ("Hittestress demo" for
that production site, "Geoblocks demo" on staging).

# Functionality overview

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

# Configuration

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

# Technical design

## Our typical app layout

The app was created using Create-React-App and uses most of its defaults.

We use Redux for state management, *most* things are in Redux as bits
of state are often used both in the left sidebar and on the map.

Things added to the map (trees and pavements) are stored in the Redux
store as WGS84 GeoJSON objects.

## Template Geoblock

A template Geoblock is a Geoblock of which some things can be changed, these are called *tags*.

In `src/state/map.ts` a request is built to create a new Geoblock by
filling in these tags on the template. The result is a new,
*temporary* Geoblock that will be cleaned up after a while (two weeks?
not sure).

For each type of tree, an array for coordinates is posted. For each
type of pavement, the polygons for that pavement type are together
posted as a MultiPolygon in WKT format.

## Comparison slider

I copied code from react-compare-image and edited it heavily so it
works on Leaflet panes. That is why the component is still called
ReactCompareImage.  The code still contains features we don't use
(like the possibility of a horizontal slider) and that are probably
broken.

The slider is a completely separate component from the Map, it's
placed over it in MainScreen.tsx. It stores its position in
'mapState.sliderPos' in Redux.

The map effect is then achieved by a `leftClip` and `rightClip` CSS
feature that is kept as state in `MainMap.tsx`, and is updated in
`updateClip()` in that component. The important bit there is the calls
to `leaflet.containerPointToLayerPoint`, without them it doesn't work.

# Directory structure

*Components* are React components without state (ideally), at least
without a connection to Redux. They are in `src/components/`.

Other React components (the main parts of the screen, components that are connected to Redux) are in `src/screens/`. Start at `MainScreen`.

Redux state is all in "ducks" in `src/state/`.

Some util functions are in `src/utils/`.

I did start on i18n in `src/i18n/`, but there is hardly anything there as this is such a Netherlands-specific app and there was time pressure.

Storybook stories are in `src/stories/`, see below, these are not part of the App code proper.

# Storybook

# Proxying for development

# Release and deployment

## Release

## Deployment

# Problems

## No translations

## Point request for popups

## Still no testing

# Future features
