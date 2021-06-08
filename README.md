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

# Development

Install dependencies simply with `yarn install` (I guess npm also works but I didn't use it).

# PROXY

- start the app using `$ yarn start`  
- By default, the proxy sends requests to https://nxt3.staging.lizard.net/  
  (for selected URLs), without authentication.  
- Set up proxy and basic authentication by following the steps [here](./BASIC_AUTH.md)
- start the app by running one of (depending on your choice in previous step) :  

`yarn start`  
or  
`PROXY_URL=https://nxt3.staging.lizard.net/ PROXY_API_KEY=123456789STAGINGKEY yarn start`  
or    
`yarn run startauth`

# Technical design

## Our typical app layout

The app was created using Create-React-App and uses most of its defaults.

We use Redux for state management, *most* things are in Redux as bits
of state are often used both in the left sidebar and on the map.

Things added to the map (trees and pavements) are stored in the Redux
store as WGS84 GeoJSON objects.

*Some* CSS values are in index.css but I didn't use them that
much. See Storybook below if you want to use them more.

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

`src/icons/` contains icons. Some are pure SVG, some are SVG turned into TSX, some have a `<div>` element and some more styling around them, depending on where they are used.

# Storybook

Simple UI-focused React components can be tested in *Storybook*. They can be developed there
and then used in larger screens.

Run it with

```
$ yarn run storybook
```

And Storybook will be available on `https://localhost:9009/`.

There is important configuration in the `.storybook/` directory; it
defines which files contain stories (*.stories.tsx files) and which
plugins we use (actions and knobs; links too but I don't think I use
it).

- Actions can show messages when a callback is used (e.g. when a button on the component is pressed)
- Knobs let the Storybook user control what value is used for a prop

Together that is enough to test the components.

`preview-head.html` is used in the template used by Storybook to render the components. It contains two important things:

- *External CSS and JS files*, in this case particularly the Google
  fonts, but I included everything we have in index.html for the App.

- The CSS from index.css, *copy and pasted*. As there is no easy way
  to include a CSS file that in the app is included by Webpack. If you
  update index.css, also update the CSS here!

# Release

Make a release with

```
$ GITHUB_TOKEN=your.github.token yarn run release
```

This uses the release-it library, see `.release-it.json` for configuration. It does:

- Update the version (it prompts for various options) in package.json and Git
- Creates a production build with the `yarn run build` script
- Includes commit messages since the last version as Changelog
- Uploads assets to Github

# Deployment

Using the same `deploy_clients.yml` in Lizard NXT as other clients
use; the lines I have in clients.yml for Hittestresstool are
currently:

```
- name: "hittestresstool-client"
  version: "0.5.6"
  zip_name: "hittestresstool-client.zip"
  # https://nxt3.staging.lizard.net/hittestresstool/
  # https://demo.lizard.net/hittestresstool/
```

# Problems

## No translations

I did start with a few I think, but because of the tight deadline and
the fact that this is inherently a Netherlands-only app, I lost
motivation. Sorry.

## Point request for popups

The `fetchValueAtPoint()` function in `src/utils/api.ts` does a
*zonal* request on a small Polygon instead of a simpler Point request;
this is because of a backend bug. This one also doesn't always work,
but it's better than nothing.

## SVGs

In `src/icons/` I did quite some work to turn SVG's from the design into TSX React Components, there is even a Python script there that will do that automatically in many cases.

However, it turns out that it is possible to simply import .svg files into React, letting Webpack do the work. I didn't know.

## Still no testing

The app has zero automated tests. Boo!

# Future features

A feature is planned to upload zipped Shapefiles for adding trees and
pavements, and also downloading them. I can that can all be done in the client.

There exist libraries for working with this file format that I am planning to use:

- https://github.com/calvinmetcalf/shapefile-js for shapefile to GeoJSON. Even with workers.

- https://github.com/mapbox/shp-write to create a zipped Shapefile from GeoJSON.
