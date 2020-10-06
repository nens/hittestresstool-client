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

## Technical design

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
