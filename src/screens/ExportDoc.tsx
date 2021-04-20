import React from 'react';

import { connect, useSelector } from 'react-redux';

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
            const pdfPage1 = document.getElementById("pdf_page_1");
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
          id="pdf_page_1"
          style={{
            width: "1900px",
            height: "1000px",
            position: "fixed",
            top: 0,
            left: 293,
            backgroundColor: "white",
            zIndex: 99999,
          }}
        >
          <h1>Hittestress PET rapport</h1>
          <h2> Kaarten</h2>
          <table>
            <tr>
              <td>
                <h3>Huidige hittestress</h3>
                <p>Uitleg over de huidige hittestress</p>
              </td>
              <td>
                <Map
                  style={{
                    width: "300px",
                    height: "500px",
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
                  />
                </Map>

              </td>
            </tr>
          </table>
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
