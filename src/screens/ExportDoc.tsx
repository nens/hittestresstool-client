import React, {useState, useEffect}  from 'react';

import { connect, useSelector,  } from 'react-redux';

import Block, { IconRow } from '../components/Block';
import CloseUndoCheckBar from '../components/CloseUndoCheckBar';
import TextButton from '../components/TextButton';
import Slider from '../components/Slider';

import FarmingAndGardening from '../icons/FarmingAndGardening';
import Tree from '../icons/Tree';

import {
  Map, TileLayer, WMSTileLayer, GeoJSON, Pane
} from 'react-leaflet';
import {getConfiguration} from '../state/session';
import Leaflet, { LatLng } from 'leaflet';


import {
  Tree as TreeT,
  TREES,
  getEditing,
  getOpenBlock,
  clickBlockTrees,
  getSelectedTree,
  setSelectedTree,
  startEditingTrees,
  cancelEditingTrees,
  submitEditingTrees,
  undoEditingTrees,
} from '../state/sidebar';

interface Props {
  clickBlockTrees: () => void,
  setSelectedTree: (arg0: TreeT) => void,
  startEditingTrees: () => void,
  cancelEditingTrees: () => void,
  undoEditingTrees: () => void,
  submitEditingTrees: () => void,
}

const ExportDoc: React.FC<Props> = ({
  clickBlockTrees,
  setSelectedTree,
  startEditingTrees,
  cancelEditingTrees,
  submitEditingTrees,
  undoEditingTrees,
}) => {
  const editing = useSelector(getEditing);
  const openBlock = useSelector(getOpenBlock);
  const selectedTree = useSelector(getSelectedTree);

  const [wms1Loaded, setwms1Loaded] = useState(false);
  const [wms2Loaded, setwms2Loaded] = useState(false);
  const [wms3Loaded, setwms3Loaded] = useState(false);

  const openAsDocumentInNewWindow = () => {
    const pdfPage1Element = document.getElementById("pdf_page_1");
    // @ts-ignore
    var pdfPage1 = pdfPage1Element.cloneNode(true);
    console.log('pdfPage1', pdfPage1);
    const newWindow = window.open();
    // @ts-ignore
    // newWindow.document.header.innerHtml = 
    // `
    // <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
    // <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css" rel="stylesheet">
    // `
    // (`
    // <head>
    // <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
    // <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css" rel="stylesheet">
    // </head>
    // `);
    // @ts-ignore
    newWindow.document.body.appendChild(pdfPage1);

    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css";
    // @ts-ignore
    newWindow.document.body.appendChild(link);
  }

  useEffect(() => {
    if (wms1Loaded && wms2Loaded && wms3Loaded) {
      openAsDocumentInNewWindow();
    }
  }, [wms1Loaded,wms2Loaded,wms3Loaded]);

  const configuration = useSelector(getConfiguration);

  const initialBounds = Leaflet.latLngBounds(
    // @ts-ignore
    Leaflet.latLng(configuration.initialBounds.sw),
    // @ts-ignore
    Leaflet.latLng(configuration.initialBounds.ne)
  );


  const blockStatus = openBlock === 'trees' ? "opened" : editing ? "disabled" : "closed";
  const editingTrees = openBlock === 'trees' && editing;

  // Functions to convert indexes 0, 1, 2 to Tree types
  const idxToTree = (idx: number): TreeT => (TREES[idx] || "tree_5m");
  const treeToIdx = (t: TreeT) => {
    return {
      "tree_5m": 0,
      "tree_10m": 1,
      "tree_15m": 2
    }[t];
  };

  return (
    <Block
      title="Export"
      icon={<Tree/>}
      status={blockStatus}
      onOpen={clickBlockTrees}
      
    >
      <IconRow>
        
        <button 
          onClick={()=>{
            const pdfPage1Element = document.getElementById("pdf_page_1");
            // @ts-ignore
            var pdfPage1 = pdfPage1Element.cloneNode(true);
            console.log('pdfPage1', pdfPage1);
            const newWindow = window.open();
            // @ts-ignore
            // newWindow.document.header.innerHtml = 
            // `
            // <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
            // <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css" rel="stylesheet">
            // `
            // (`
            // <head>
            // <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
            // <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css" rel="stylesheet">
            // </head>
            // `);
            // @ts-ignore
            newWindow.document.body.appendChild(pdfPage1);

            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css";
            // @ts-ignore
            newWindow.document.body.appendChild(link);
          }}
        >
          Export as doc
        </button>
        {/* ____________________________________________________________________  */}

        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 293,
            zIndex: 99999,
          }}
        >
          <div
            id="pdf_page_1"
            style={{
              width: "1000px",
              height: "19000px",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <h1>Hittestress PET rapport</h1>
            <h2> Kaarten</h2>
            <table>
              <tbody>
              <tr>
                <td>
                  <h3>Huidige hittestress</h3>
                  <p>Uitleg over de huidige hittestress</p>
                </td>
                <td>
                  <Map
                    style={{
                      width: "400px",
                      height: "300px",
                    }}
                    zoomControl={false}
                    bounds={initialBounds}
                    doubleClickZoom={false}
                    closePopupOnClick={false}
                    dragging={false}
                    // @ts-ignore \*}
                    // zoomSnap={false}
                    // @ts-ignore 
                    // zoomDelta={false}
                    trackResize={false}
                    touchZoom={false}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      // @ts-ignore
                      url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${configuration.mapboxAccessToken}`}
                      zIndex={0}
                    />
                    <WMSTileLayer
                      key="heatstress-original"
                      url="http://nxt3.staging.lizard.net/wms/"
                      // @ts-ignore
                      layers={configuration.originalHeatstressLayer}
                      // @ts-ignore
                      styles={configuration.heatstressStyle}
                      updateWhenIdle={true}
                      updateWhenZooming={false}
                      updateInterval={1000}
                      onload={()=>{
                        setwms1Loaded(true);
                      }}
                    />
                  </Map>

                </td>
              </tr>
              <tr>
              <td>
                  <h3>Hittestress na maatregelen</h3>
                  <p>Uitleg over hittestress na maatregelen</p>
                </td>
                <td>
                  <Map
                    style={{
                      width: "400px",
                      height: "300px",
                    }}
                    zoomControl={false}
                    bounds={initialBounds}
                    doubleClickZoom={false}
                    closePopupOnClick={false}
                    dragging={false}
                    // @ts-ignore \*}
                    // zoomSnap={false}
                    // @ts-ignore 
                    // zoomDelta={false}
                    trackResize={false}
                    touchZoom={false}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      // @ts-ignore
                      url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${configuration.mapboxAccessToken}`}
                      zIndex={0}
                    />
                    <WMSTileLayer
                      key="heatstress-original"
                      url="http://nxt3.staging.lizard.net/wms/"
                      // @ts-ignore
                      layers={configuration.originalHeatstressLayer}
                      // @ts-ignore
                      styles={configuration.heatstressStyle}
                      updateWhenIdle={true}
                      updateWhenZooming={false}
                      updateInterval={1000}
                      onload={()=>{
                        setwms2Loaded(true);
                      }}
                    />
                  </Map>

                </td>
              </tr>
              <tr>
              <td>
                  <h3>Verschil in hittestress</h3>
                  <p>Uitleg over verschil in hittestress</p>
                </td>
                <td>
                  <Map
                    style={{
                      width: "400px",
                      height: "300px",
                    }}
                    zoomControl={false}
                    bounds={initialBounds}
                    doubleClickZoom={false}
                    closePopupOnClick={false}
                    dragging={false}
                    // @ts-ignore \*}
                    // zoomSnap={false}
                    // @ts-ignore 
                    // zoomDelta={false}
                    trackResize={false}
                    touchZoom={false}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      // @ts-ignore
                      url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${configuration.mapboxAccessToken}`}
                      zIndex={0}
                    />
                    <WMSTileLayer
                      key="heatstress-original"
                      url="http://nxt3.staging.lizard.net/wms/"
                      // @ts-ignore
                      layers={configuration.originalHeatstressLayer}
                      // @ts-ignore
                      styles={configuration.heatstressStyle}
                      updateWhenIdle={true}
                      updateWhenZooming={false}
                      updateInterval={1000}
                      onload={()=>{
                        setwms3Loaded(true);
                      }}
                    />
                  </Map>

                </td>
              </tr>
              </tbody>
            </table>
            <h1>Hittestress PET rapport</h1>
            <h2> Verdeling gevoelstemperatuur</h2>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div
                      style={{
                        height: "300px",
                        width: "400px"
                      }}
                    >
                    <h1>Todo Bar chart temperature</h1>
                    </div>
                  </td>
                  <td>
                      <h3>Gemiddelde gevoelstemperatuur</h3>
                      <p>De gemiddelde temperatuur in dit gebied, voor en na de maatregelen. </p>
                      <b>Belangrijk:</b>
                      <br/>
                      <p>
                      Er kunnen grote verschillen zitten de verharding van een gebied (denk aan een grote strook groen, maar ook een grote parkeerplaats). Daarom kunnen deze cijfers een vertekend beeld geven.
                      </p>
                      <table>
                        <thead>
                          <tr>
                            <td><b>Huidige situatie</b></td>
                            <td><b>Huidige situatie</b></td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              31°
                            </td>
                            <td>
                              26.5°
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <h2> Statistieken</h2>
            <table>
              <thead>
                <tr>
                  <td>
                      Indicatoren
                  </td>
                  <td>
                      Huidige situatie
                  </td>
                  <td>
                      Na maatregelen
                  </td>
                </tr>
              </thead>
              <tbody>
                    <tr>
                      <td>
                        Percentage schaduw
                      </td>
                      <td>
                        20%
                      </td>
                      <td>
                        40%
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Percentage bomen
                      </td>
                      <td>
                        10%
                      </td>
                      <td>
                        15%
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Groen vs. verhard oppervlak
                      </td>
                      <td>
                        30/70
                      </td>
                      <td>
                        30/70
                      </td>
                    </tr>
              </tbody>
            </table>
            <h2> Over de hittestress tool</h2>
            <p>
              <b>PET staat voor 'Physiological Equivalent Temperature'. </b>De kaart laat de gevoelstemperatuur in de buitenruimte zien. Op het Kennisportaal Ruimtelijke Adaptatie vindt u een duidelijke uitleg over hoe een PET-kaart wordt opgebouwd volgens de landelijke methodiek. 
            </p>
            <p>
            Voor het berekenen van de PET-hittestresskaart, worden veel verschillende informatiebronnen gebruikt. Denk daarbij aan KNMI meteogegevens (luchttemperatuur, luchtvochtigheid, en straling), en gegevens over het gebied zelf (zoals schaduw, groenfactor en skyviewfactor). Met de Lizard Geoblocks module worden al deze kaarten on-the-fly gecombineerd tot de PET-hittestresskaart. Het voordeel is dat wanneer een van de bronnen geactualiseerd wordt, de PET-hittestresskaart automatisch herberekend wordt met de meest actuele gegevens. De oude kaarten zijn natuurlijk ook nog beschikbaar!
            </p>
          </div>
        </div>
      
      
      
      {/* ____________________________________________________________________  */}
      </IconRow>
    </Block>
  );
};

export default connect(null, {
  clickBlockTrees,
  setSelectedTree,
  startEditingTrees,
  cancelEditingTrees,
  submitEditingTrees,
  undoEditingTrees
})(ExportDoc);
