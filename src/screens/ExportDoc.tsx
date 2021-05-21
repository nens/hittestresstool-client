import React, {useState, useEffect,}  from 'react';
import { connect, useSelector,  } from 'react-redux';
import Block, { IconRow } from '../components/Block';
import DownloadIcon from '../icons/Download';
import {
  Map, TileLayer, WMSTileLayer,GeoJSON
} from 'react-leaflet';
import {getConfiguration, getLegendSteps, getDifferenceLegendSteps} from '../state/session';
import Legend from '../components/LegendPdf';
import Leaflet  from 'leaflet';
import {
  getMapState,
  getTemplatedUuid,
} from '../state/map';
import {
  addMessage,
} from '../state/message';
import {
  getOpenBlock,
  getChangesMade,
  getChangesProcessed,
  clickBlockReport,
  getEditing,
  startEditingReportPolygon,
  cancelEditingReportPolygon,
  submitEditingReportPolygon,
  undoEditingReportPolygon,
  getAnyTreesOrPavements,
 } from '../state/sidebar';
 import {
  getReportPolygonsOnMap,
 } from '../state/reportPolygons';
 import TextButton from '../components/TextButton';
 import Pencil from '../icons/Pencil';
 import PdfIcon from '../icons/PdfIcon';
 import CloseUndoCheckBar from '../components/CloseUndoCheckBar';
import { curveApiToHistogram, } from '../utils/curveApiToHistogram';
import * as Plotly from 'plotly.js';
import {polygonOnMapToGeometryString} from '../utils/geometry';


interface Props {
  addMessage: (message: string) => void,
  clickBlockReport: () => void,
  startEditingReportPolygon: () => void,
  cancelEditingReportPolygon: () => void,
  undoEditingReportPolygon: () => void,
  submitEditingReportPolygon: () => void,
}

const ExportDoc: React.FC<Props> = ({
  addMessage,
  clickBlockReport,
  startEditingReportPolygon,
  cancelEditingReportPolygon,
  undoEditingReportPolygon,
  submitEditingReportPolygon,
}) => {
  const mapState = useSelector(getMapState);
  const changesMade = useSelector(getChangesMade);
  const changesProcessed = useSelector(getChangesProcessed)
  const anyTreesOrPavements = useSelector(getAnyTreesOrPavements);
  const configuration = useSelector(getConfiguration);
  const templatedUuid = useSelector(getTemplatedUuid);
  const openBlock = useSelector(getOpenBlock);
  const editing = useSelector(getEditing);
  const reportPolygonsOnMap = useSelector(getReportPolygonsOnMap);
  const legendSteps = useSelector(getLegendSteps);
  const differenceLegendSteps = useSelector(getDifferenceLegendSteps);

  const [wms1Loaded, setwms1Loaded] = useState(false);
  const [wms2Loaded, setwms2Loaded] = useState(false);
  const [wms3Loaded, setwms3Loaded] = useState(false);
  const [docRequested, setDocRequested] = useState(false);
  const [imageData, setImagedata] = useState<null | string>(null);
  const [averageTempAfterMeasurements,setAverageTempAfterMeasurements] = useState<null | string>(null);
  const [averageTempBeforeMeasurements,setAverageTempBeforeMeasurements] = useState<null | string>(null);
  const [reportMapBounds, setReportMapBounds] = useState<L.LatLngBounds | null>(null);
  const [averageOriginalShadow, setAverageOriginalShadow] = useState<null | string>(null);
  const [averageNewShadow, setAverageNewShadow] = useState<null | string>(null);
  const [percentageTrees, setPercentageTrees] = useState<null | string>(null);
  const [newPercentageTrees, setNewPercentageTrees] = useState<null | string>(null);
  const [fractionUnpaved, setFractionUnpaved] = useState<null | string>(null);
  const [newFractionUnpaved, setNewFractionUnpaved] = useState<null | string>(null);

  const editingReportPolygon = openBlock === 'report' && editing;

    const fetchChartData = async () => {

      if (!configuration) {
        return;
      }
      if (!reportPolygonsOnMap.features[0]) {
        console.log('report polyon not found aborting');
        return;
      }
      
      const uuid = configuration.templateUuid;
      const url = '/api/v4/rasters/';
      const geom = polygonOnMapToGeometryString(reportPolygonsOnMap);
      
      const response = await fetch(
        `${url}${uuid}/curve?geom=${geom}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        }
      );
      const responseJson = await response.json();

      const responseAfterMeasurements = await fetch(
        `${url}${templatedUuid}/curve?geom=${geom}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        }
      );
      const responseJsonAfterMeasurements = await responseAfterMeasurements.json();

      if (responseJson.results && responseJsonAfterMeasurements.results) {
        const histogramData = curveApiToHistogram(responseJson.results);
        const histogramDataAfterMeasurements = curveApiToHistogram(responseJsonAfterMeasurements.results);
        //////////////////////////////////////////////////////////////////////////////////////////////

        const data = [
          {
            type: 'bar', 
            x: histogramData.map((item:number, ind:number)=>ind), 
            y: histogramData.map((value:number)=>value), 
            marker: {color: 'blue'},
            name: "Huidige projectlocatie",
          },
          {
            type: 'bar', 
            x: histogramDataAfterMeasurements.map((item:number,ind:number)=>ind), 
            y: histogramDataAfterMeasurements.map((value:number)=>value), 
            marker: {color: 'red'},
            name: "Ontwerp projectlocatie",
          },
        ];

        const layout = {
          width: 400, 
          height: 300, 
          // autosize: false,
          // margin: {
          //   l: 30,
          //   r: 10,
          //   b: 30,
          // },
          title: 'Distributie gevoelstemperatuur',
          // displayodeBar: false,
          
          showlegend: true,
          legend: {
            x: 0,
            y: 10,
            bgcolor: '#FFFFFF00'
          },
          xaxis: {
            title: {
              text: "temperatuur (°C)",
              // standoff: 5
            },
          },
          yaxis: {
            title: {
              text: "Percentage (%)",
              // standoff: 10
            },
            // exponentformat: "power",
            // automargin: true,
          },
        };

        const config = {
          displayModeBar: false,
        };

        // todo handle if user switches tab when waiting for export
        // possible options: move plotly element to root html, or disable switching tabs when user waits for html
        try {
          // We draw the diagram with plotly (not react-plotly) and then use the image data for the pdf, because the css of react-plotly didnot get send correctly to the new browser window
          // @ts-ignore
          Plotly.newPlot('plotly_graph_to_image_id', data, layout, config).then((gd) => {
            // @ts-ignore  
          // @ts-ignore  
            // @ts-ignore  
            return Plotly.toImage(gd);
          }).then((dataURI:any) => {
              setImagedata(dataURI);
          })
        } catch(e) {
          console.error(e)
        }
        
      }
    }

  const fetchMean = async (uuid: string, setFunction: (temperature: string) => void, arity: number) => {

    if (!configuration) {
      return;
    }
    const url = '/api/v4/rasters/';
    const geom = polygonOnMapToGeometryString(reportPolygonsOnMap);
    
    const response = await fetch(
      `${url}${uuid}/zonal?geom=${geom}&zonal_statistic=mean&pixel_size=10&zonal_projection=EPSG:28992`,
      {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      }
    );
    const responseJson = await response.json();

    if (responseJson.results) {
      setFunction(responseJson.results[0].value.toFixed(arity));
    }
  }

    
  const openAsDocumentInNewWindow = () => {
    const pdfPage1Element = document.getElementById("pdf_page_1");
    
    if (!pdfPage1Element) {
      console.error('pdf html "pdf_page_1" element not found');
      return;
    }
    var pdfPage1 = pdfPage1Element.cloneNode(true);
    const newWindow = window.open();
   
    if (newWindow) {
      newWindow.document.body.appendChild(pdfPage1);
      const link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css";
      newWindow.document.body.appendChild(link);

      const linkFont = document.createElement("link");
      linkFont.type = "text/css";
      linkFont.rel = "stylesheet";
      linkFont.href = "https://fonts.googleapis.com/css?family=Montserrat";
      newWindow.document.body.appendChild(linkFont);

      
    } else {
      alert('failed to export. Are you blocking popup windows?');
    }
    
  }

  useEffect(() => {
    if (
      wms1Loaded && wms2Loaded && wms3Loaded && 
      imageData &&
      averageTempBeforeMeasurements && averageTempAfterMeasurements &&
      averageOriginalShadow && averageNewShadow && 
      percentageTrees && newPercentageTrees && 
      fractionUnpaved && newFractionUnpaved &&
      docRequested
      ) {
      // add extra timeout for wms to properly visualize ?! If I don't do this I get half transparent wms..
      // comment out temporarily for dev
      window.setTimeout(()=>{
        openAsDocumentInNewWindow();
        setDocRequested(false);
        setImagedata(null);
        setAverageTempBeforeMeasurements(null);
        setAverageTempAfterMeasurements(null);

        setAverageOriginalShadow(null);
        setAverageNewShadow(null);
        setPercentageTrees(null);
        setNewPercentageTrees(null);
        setFractionUnpaved(null);
        setNewFractionUnpaved(null);

      },3000);
      
    }
  }, [wms1Loaded,wms2Loaded,wms3Loaded, imageData, docRequested, averageTempBeforeMeasurements, averageTempAfterMeasurements, averageOriginalShadow, averageNewShadow, percentageTrees, newPercentageTrees, fractionUnpaved, newFractionUnpaved]);

  useEffect(() => {
        setwms2Loaded(false);
        setwms3Loaded(false);
  }, [templatedUuid]);

  useEffect(() => {
    if (reportPolygonsOnMap.features.length !== 0) {
      const coordsInitial = reportPolygonsOnMap.features[0].geometry.coordinates[0].slice();
      coordsInitial.push(
        coordsInitial[0]
      )
      const poly = Leaflet.polygon(coordsInitial.map(arr=>[arr[1],arr[0]]));
      setReportMapBounds(poly.getBounds());
    }
  }, [reportPolygonsOnMap]);

  useEffect(() => {
    if (editingReportPolygon) {
      setReportMapBounds(null);
      setwms1Loaded(false);
      setwms2Loaded(false);
      setwms3Loaded(false);
    }
  }, [editingReportPolygon]);

  
  useEffect(() => {
    if ( docRequested && changesProcessed) {
      fetchChartData();
      if (configuration?.templateUuid) {
        fetchMean(configuration.templateUuid, setAverageTempBeforeMeasurements, 1);
      }
      if (templatedUuid) {
        fetchMean(templatedUuid, setAverageTempAfterMeasurements, 1);
      }
      if (configuration?.originalShadeRasterUuid) {
        fetchMean(configuration.originalShadeRasterUuid, setAverageOriginalShadow, 2);
      }
      if (configuration?.originalTreesRasterUuid) {
        fetchMean(configuration.originalTreesRasterUuid, setPercentageTrees, 4);
      }
      if (configuration?.originalPavedRasterUuid) {
        fetchMean(configuration.originalPavedRasterUuid, setFractionUnpaved, 4);
      }
      if (mapState.templatedUuidPercentageShadow) {
        fetchMean(mapState.templatedUuidPercentageShadow, setAverageNewShadow, 2);
      }
      if (mapState.templatedTreesUuid) {
        fetchMean(mapState.templatedTreesUuid, setNewPercentageTrees, 2);
      }
      if (mapState.templatedPavedUuid) {
        fetchMean(mapState.templatedPavedUuid, setNewFractionUnpaved, 2);
      }
    }
  }, [docRequested, changesProcessed]); // eslint-disable-line react-hooks/exhaustive-deps
  

  return (
    <Block
      title="Rapport"
      icon={<PdfIcon/>}
      status={
         !anyTreesOrPavements || changesMade || !templatedUuid || !changesProcessed || (editing && openBlock !== 'report') ? 
          "disabled" : 
          openBlock === 'report' ? "opened" :  "closed"
      } 
      onOpen={()=>{
        clickBlockReport();
      }}
      style={openBlock === 'report'? {height: "11rem"} : undefined}
    >

        <div id="plotly_graph_to_image_id" 
          style={{ display: "none" }}
          // below style usefull for styling debugging plotly
          // style={{ 
          //     position: "fixed",
          //     zIndex: 999999,
          //     right: 0,
          //     top: 0,
          //     width: '700px',
          //     height: '525px',
          //   }}
        ></div>
        {editingReportPolygon ?
         <IconRow>
          <CloseUndoCheckBar
            onClose={cancelEditingReportPolygon}
            onUndo={undoEditingReportPolygon}
            onCheck={submitEditingReportPolygon}
          />
         </IconRow>
        :
        reportPolygonsOnMap.features.length === 0?
        <IconRow>
          <TextButton text="Teken op kaart" 
              icon={<Pencil/>}
              onClick={()=>{
                startEditingReportPolygon();
              }} 
          />
        </IconRow>
        : 
        <>
          <IconRow>
          <TextButton text="Teken opnieuw" 
              icon={<Pencil/>}
              onClick={()=>{
                startEditingReportPolygon();
              }}
              disabled={docRequested} 
              disabledReason={docRequested? "Bezig rapport te genereren .." : undefined} 
          />
          </IconRow>
          <IconRow>
          <TextButton text="Maak rapport" 
              onClick={()=>{
                if (!docRequested) {
                  addMessage("Export document aangevraagd");
                  setDocRequested(true);
                }
                
              }}
              disabled={docRequested} 
              disabledReason={docRequested? "Bezig rapport te genereren .." : undefined}
          />
          </IconRow>
        </> 
        }
      

      
      {reportPolygonsOnMap.features.length !== 0 && reportMapBounds && !changesMade && docRequested?
      <div 
        // hide here. Only show it in a new browser tab
        style={{visibility: "hidden"}}
      >
      <IconRow>
        

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
          >
            <style>{`
              #pdf_page_1 {
                width: 210mm;
                /* leave out padding, use default margins from browser print feature instead */
                /* padding: 10mm; */
                background-color: white;
                color: #515152;
                font-family: 'Montserrat', sans-serif;
              }

              @media print {
                #pdf_page_1 .noprint {
                   display: none;
                }
              }

              #pdf_page_1 h1 {
                margin-top: 0;
                margin-bottom: 10mm;
                color: teal;
              }

              #pdf_page_1 h1.new_page {
                margin-top: 200mm;
              }

              #pdf_page_1 h2 {
                font-size: 7mm;
              }
              #pdf_page_1 hr {
                margin-bottom: 10mm;
              }

              #pdf_page_1 .two_column_row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10mm;
              }

              p.overhittestresstext {
                font-size: 10px;
              }
            `}</style>
            <div
              className="noprint"
            >
              {/* {`To save this document as .pdf do as follows:
              Go to: Settings >> Print
              - As "destination" choose "Print as PDF"
              - Go to "More settings"
              - As "margin" choose "default"
              - Check the checkbox "print backgrounds" or "background graphics"
              `}  */}
              Om op te slaan als .pdf doe als volgt:
              <br/>
              <ul>
                <li>Toets CTRL+P om het print-scherm te openen</li>
                <li>Als "destination" kies "Print as PDF"</li>
                <li>Ga naar "More settings" in het print-scherm</li>
                <li>Als "margin" kies "default"</li>
                <li>Check de checkbox "print backgrounds"(in Firefox) of "background graphics" (in Chrome)</li>
                <li>Klik op de "Print" knop</li>
              </ul>
            </div>
            <h1>
              Hittestress PET rapport
            </h1>
            <h2> Kaarten</h2>
            <hr></hr>
            
                <div 
                  className="two_column_row"
                >
                <div>
                  <h3>Huidige hittestress</h3>
                  {/* <p>Uitleg over de huidige hittestress</p> */}
                </div>
                <div>
                  
                  <Map
                    style={{
                      width: "110mm",
                      height: "75mm",
                    }}
                    zoomControl={false}
                    bounds={reportMapBounds}
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
                      url={window.location.host.includes('staging')? "http://nxt3.staging.lizard.net/wms/" : "http://demo.lizard.net/wms/"}
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
                    <GeoJSON
                      data={reportPolygonsOnMap}
                      style={(feature: any) => {
                        return {
                          fillOpacity: 0
                        };
                      }}
                    />
                    {legendSteps !== null && configuration !==null && (
                      <Legend steps={legendSteps} style={configuration.heatstressStyle}/>
                    )}
                  </Map>
                </div>
                </div>
              <div 
                  className="two_column_row"
                >
                  <div>
                  <h3>Hittestress na maatregelen</h3>
                  {/* <p>Uitleg over hittestress na maatregelen</p> */}
                </div>
                <div>
                  <Map
                    style={{
                      width: "110mm",
                      height: "75mm",
                    }}
                    zoomControl={false}
                    bounds={reportMapBounds}
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
                      url={`http://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${configuration.mapboxAccessToken}`}
                      zIndex={0}
                    />
                    <WMSTileLayer
                      key="heatstress-original"
                      url={window.location.host.includes('staging')? "http://nxt3.staging.lizard.net/wms/" : "http://demo.lizard.net/wms/"}
                      // @ts-ignore
                      layers={mapState.templatedLayer!}
                      // @ts-ignore
                      styles={configuration.heatstressStyle}
                      updateWhenIdle={true}
                      updateWhenZooming={false}
                      updateInterval={1000}
                      onload={(event)=>{
                        setwms2Loaded(true);
                      }}
                    />
                    <GeoJSON
                      data={reportPolygonsOnMap}
                      style={(feature: any) => {
                        return {
                          fillOpacity: 0
                        };
                      }}
                    />
                     {legendSteps !== null && configuration !==null && (
                      <Legend steps={legendSteps} style={configuration.heatstressStyle}/>
                    )}
                    
                  </Map>
                  </div>
                  </div>
                
                  <div 
                    className="two_column_row"
                  >
                    <div>
              
                  <h3>Verschil in hittestress</h3>
                  {/* <p>Uitleg over verschil in hittestress</p> */}
                  </div>
                  <div>
                  <Map
                    style={{
                      width: "110mm",
                      height: "75mm",
                    }}
                    zoomControl={false}
                    bounds={reportMapBounds}
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
                      url={window.location.host.includes('staging')? "http://nxt3.staging.lizard.net/wms/" : "http://demo.lizard.net/wms/"}
                      // @ts-ignore
                      // layers={configuration.originalHeatstressLayer}
                      layers={mapState.templatedDifferenceLayer!}
                      // @ts-ignore
                      styles={configuration.differenceMapStyle}
                      // styles={configuration.heatstressStyle}
                      updateWhenIdle={true}
                      updateWhenZooming={false}
                      updateInterval={1000}
                      onload={()=>{
                        setwms3Loaded(true);
                      }}
                    />
                    <GeoJSON
                      data={reportPolygonsOnMap}
                      style={(feature: any) => {
                        return {
                          fillOpacity: 0
                        };
                      }}
                    />
                     {differenceLegendSteps !== null && configuration !==null && (
                      <Legend steps={differenceLegendSteps} style={configuration.differenceMapStyle}/>
                    )}
                  </Map>
                  </div>
                  </div>

               
            <h1 className="new_page">Hittestress PET rapport</h1>
            <h2> Verdeling gevoelstemperatuur</h2>
            <hr></hr>
            <div 
                    className="two_column_row"
                  >
                    <div>
                      {imageData? <img height="300" width="400" alt="temperatuur curve histogram voor en na maatregel" src={imageData}></img>:null}
                    </div>
                    <div 
                      style={{
                        width: "100mm",
                      }}
                    >
                  
                      <h3>Gemiddelde gevoelstemperatuur</h3>
                      <p>De gemiddelde temperatuur in dit gebied, voor en na de maatregelen. </p>
                      <b>Belangrijk:</b>
                      <br/>
                      <p>
                      Er kunnen grote verschillen zitten de verharding van een gebied (denk aan een grote strook groen, maar ook een grote parkeerplaats). Daarom kunnen deze cijfers een vertekend beeld geven.
                      </p>
                      <table 
                        style={{width: "100%"}}
                      >
                        <thead>
                          <tr>
                            <td><b>Huidige situatie</b></td>
                            <td><b>Na maatregelen</b></td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {averageTempBeforeMeasurements}°
                            </td>
                            <td>
                              {averageTempAfterMeasurements}°
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                      </div>
            <h2> Statistieken</h2>
            <hr></hr>
            <style>{`

              table.shade_table {
                border-spacing: 0;
                border-collapse: collapse;
                width: 100%;
              }

              table.shade_table td {
                height: 70px;
                width: 200px;
                border-width: 2mm;
                border-color: #515152;
              }
              table.shade_table thead td {
                height: 50px;
                font-weight: bold;
              }
              table.shade_table tbody td {
                text-align: center;
                border-left-style: solid;
                border-right-style: solid;
              }

              table.shade_table tbody tr:first-child td {
                border-top-style: solid;
              }
              table.shade_table tbody tr:last-child td{
                border-bottom-style: solid;
              }

            `}</style>
            <table className="shade_table">
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
                        {/* 20% */}
                        {`${(parseFloat(averageOriginalShadow || "0")*100).toFixed(0)}%`}
                      </td>
                      <td>
                      {`${(parseFloat(averageNewShadow || "0")*100).toFixed(0)}%`}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Percentage bomen
                      </td>
                      <td>
                        {/* 10% */}
                        {`${(parseFloat(percentageTrees || "0")*100).toFixed(0)}%`}
                      </td>
                      <td>
                      {`${(parseFloat(newPercentageTrees || "0")*100).toFixed(0)}%`}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Groen vs. verhard oppervlak
                      </td>
                      <td>
                        {/* 30/70 */}
                        {fractionUnpaved === null? "": `${(parseFloat(fractionUnpaved || "0")*100).toFixed(0)}/${(100-(parseFloat(fractionUnpaved || "0")*100)).toFixed(0)}`}
                      </td>
                      <td>
                        {/* 30/70 */}
                        {newFractionUnpaved === null? "": `${(parseFloat(newFractionUnpaved || "0")*100).toFixed(0)}/${(100-(parseFloat(newFractionUnpaved || "0")*100)).toFixed(0)}`}
                      </td>
                    </tr>
              </tbody>
            </table>
            <h2> Over de hittestress tool</h2>
            <hr></hr>
            <p className={"overhittestresstext"}>
              <b>PET staat voor 'Physiological Equivalent Temperature'. </b>De kaart laat de gevoelstemperatuur in de buitenruimte zien. Op het Kennisportaal Ruimtelijke Adaptatie vindt u een duidelijke uitleg over hoe een PET-kaart wordt opgebouwd volgens de landelijke methodiek. 
            </p>
            <p className={"overhittestresstext"}>>
            Voor het berekenen van de PET-hittestresskaart, worden veel verschillende informatiebronnen gebruikt. Denk daarbij aan KNMI meteogegevens (luchttemperatuur, luchtvochtigheid, en straling), en gegevens over het gebied zelf (zoals schaduw, groenfactor en skyviewfactor). Met de Lizard Geoblocks module worden al deze kaarten on-the-fly gecombineerd tot de PET-hittestresskaart. Het voordeel is dat wanneer een van de bronnen geactualiseerd wordt, de PET-hittestresskaart automatisch herberekend wordt met de meest actuele gegevens. De oude kaarten zijn natuurlijk ook nog beschikbaar!
            </p>
          </div>
        </div>
      
      {/* ____________________________________________________________________  */}
      </IconRow>
      </div>
      :null}
    </Block>
  );
};

export default connect(null, {
  addMessage,
  clickBlockReport,
  startEditingReportPolygon,
  cancelEditingReportPolygon,
  undoEditingReportPolygon,
  submitEditingReportPolygon,
})(ExportDoc);
