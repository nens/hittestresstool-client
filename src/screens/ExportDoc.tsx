import React, {useState, useEffect}  from 'react';
import { connect, useSelector,  } from 'react-redux';
import Block, { IconRow } from '../components/Block';
import DownloadIcon from '../icons/Download';
import {
  Map, TileLayer, WMSTileLayer
} from 'react-leaflet';
import {getConfiguration} from '../state/session';
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
  clickBlockReport,
  getEditing,
  startEditingReportPolygon,
  cancelEditingReportPolygon,
  submitEditingReportPolygon,
  undoEditingReportPolygon,

 } from '../state/sidebar';
 import TextButton from '../components/TextButton';
 import Pencil from '../icons/Pencil';
 import CloseUndoCheckBar from '../components/CloseUndoCheckBar';




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
  const configuration = useSelector(getConfiguration);
  const templatedUrl = useSelector(getTemplatedUuid);
  const openBlock = useSelector(getOpenBlock);
  const editing = useSelector(getEditing);


  const [wms1Loaded, setwms1Loaded] = useState(false);
  const [wms2Loaded, setwms2Loaded] = useState(false);
  const [wms3Loaded, setwms3Loaded] = useState(false);
  const [docRequested, setDocRequested] = useState(false);

  const editingReportPolygon = openBlock === 'report' && editing;

  console.log('editing', openBlock, editing, editingReportPolygon)

  // if (!configuration) {
  //   return null;
  // }

  const initialBounds = Leaflet.latLngBounds(
    // @ts-ignore
    Leaflet.latLng(configuration.initialBounds.sw),
    // @ts-ignore
    Leaflet.latLng(configuration.initialBounds.ne)
  );


    

    const fetchChartData = async () => {

      if (!configuration) {
        return;
      }
      const uuid = configuration.templateUuid;
      const url = '/api/v4/rasters/';
      const geom = `POLYGON ((${configuration.initialBounds.sw.lng} ${configuration.initialBounds.sw.lat}, ${configuration.initialBounds.sw.lng} ${configuration.initialBounds.ne.lat}, ${configuration.initialBounds.ne.lng} ${configuration.initialBounds.ne.lat}, ${configuration.initialBounds.ne.lng} ${configuration.initialBounds.sw.lat}, ${configuration.initialBounds.sw.lng} ${configuration.initialBounds.sw.lat}))`;
      // const parameters = { 
      //   geom: 'POLYGON ((4.804847821873415 52.11667280734238, 4.806713259859531 52.11808327571072, 4.805608147820809 52.11856102711491, 4.819366745114616 52.12916174862249, 4.820391627911995 52.12882844174937, 4.825146482688536 52.13155708895362, 4.836760218799797 52.1320950542045, 4.839831083487208 52.13138455359988, 4.841855268314998 52.13279519337573, 4.844997575437689 52.13266472167823, 4.851613567129445 52.13095545048285, 4.850995342194573 52.13013121164453, 4.855100260574258 52.12826534499285, 4.858115526952704 52.1255730225948, 4.857260037781153 52.12489270966972, 4.857432505687366 52.12358885970951, 4.856966250193945 52.12318812892995, 4.857412305450096 52.12198214729695, 4.855523610331791 52.12072942129434, 4.855459491604404 52.1195211452892, 4.856410703395785 52.11874023894567, 4.857189725526387 52.11758407511068, 4.857006548770007 52.11648398314836, 4.858161027579516 52.11509998252357, 4.860588442243921 52.11558196309642, 4.862378153957152 52.11356052316284, 4.863167486792669 52.11317747763539, 4.862651303280372 52.11034849069802, 4.864831936661076 52.10842539029259, 4.864544590469517 52.1078322025319, 4.866034352158711 52.1062563318614, 4.867314973640948 52.10409968552982, 4.86967559135546 52.10353023647684, 4.865590360499596 52.09723068553979, 4.86211402445756 52.09595894201262, 4.861573683244572 52.09520757940017, 4.852430695728541 52.09876627241331, 4.846469734862426 52.10185569966663, 4.842415244351158 52.10297254568547, 4.837985745856069 52.10266207609867, 4.832555777932917 52.10394128701714, 4.831113012822775 52.10480424504518, 4.829541164175933 52.10500217933986, 4.82775049958501 52.10544065304562, 4.824631499045423 52.10542581163859, 4.825548195162908 52.10741128945562, 4.804847821873415 52.11667280734238))',
      // };
      // const geom = parameters.geom;
      
      const response = await fetch(
        `${url}${uuid}/curve?geom=${geom}`,
        {
          method: 'GET',
          // body: JSON.stringify({parameters}),
          headers: {'Content-Type': 'application/json'}
        }
      );
      const responseJson = await response.json();

      console.log('responseJson', responseJson);
    
      // uuid = "5a18db90-36a3-4f17-a0d2-990b3f8c6e44" #PET windstil export

      // raster_url = "https://nens.lizard.net/api/v4/rasters/"
      // get_url = f"{raster_url}{uuid}/curve/" 

      // # Geometry defining the special extend of this raster data
      // geom = 'POLYGON ((4.804847821873415 52.11667280734238, 4.806713259859531 52.11808327571072, 4.805608147820809 52.11856102711491, 4.819366745114616 52.12916174862249, 4.820391627911995 52.12882844174937, 4.825146482688536 52.13155708895362, 4.836760218799797 52.1320950542045, 4.839831083487208 52.13138455359988, 4.841855268314998 52.13279519337573, 4.844997575437689 52.13266472167823, 4.851613567129445 52.13095545048285, 4.850995342194573 52.13013121164453, 4.855100260574258 52.12826534499285, 4.858115526952704 52.1255730225948, 4.857260037781153 52.12489270966972, 4.857432505687366 52.12358885970951, 4.856966250193945 52.12318812892995, 4.857412305450096 52.12198214729695, 4.855523610331791 52.12072942129434, 4.855459491604404 52.1195211452892, 4.856410703395785 52.11874023894567, 4.857189725526387 52.11758407511068, 4.857006548770007 52.11648398314836, 4.858161027579516 52.11509998252357, 4.860588442243921 52.11558196309642, 4.862378153957152 52.11356052316284, 4.863167486792669 52.11317747763539, 4.862651303280372 52.11034849069802, 4.864831936661076 52.10842539029259, 4.864544590469517 52.1078322025319, 4.866034352158711 52.1062563318614, 4.867314973640948 52.10409968552982, 4.86967559135546 52.10353023647684, 4.865590360499596 52.09723068553979, 4.86211402445756 52.09595894201262, 4.861573683244572 52.09520757940017, 4.852430695728541 52.09876627241331, 4.846469734862426 52.10185569966663, 4.842415244351158 52.10297254568547, 4.837985745856069 52.10266207609867, 4.832555777932917 52.10394128701714, 4.831113012822775 52.10480424504518, 4.829541164175933 52.10500217933986, 4.82775049958501 52.10544065304562, 4.824631499045423 52.10542581163859, 4.825548195162908 52.10741128945562, 4.804847821873415 52.11667280734238))'

      // # request the data
      // r = requests.get(
      //             url=get_url,
      //             headers=headers,
      //             params=
      //             {"geom": geom
      //             }
      // )
    }

  const fetchMean = async () => {

    if (!configuration) {
      return;
    }
    const uuid = templatedUrl; // configuration.templateUuid;
    const url = '/api/v4/rasters/';
    const geom = `POLYGON ((${configuration.initialBounds.sw.lng} ${configuration.initialBounds.sw.lat}, ${configuration.initialBounds.sw.lng} ${configuration.initialBounds.ne.lat}, ${configuration.initialBounds.ne.lng} ${configuration.initialBounds.ne.lat}, ${configuration.initialBounds.ne.lng} ${configuration.initialBounds.sw.lat}, ${configuration.initialBounds.sw.lng} ${configuration.initialBounds.sw.lat}))`;
    // const parameters = { 
    //   geom: 'POLYGON ((4.804847821873415 52.11667280734238, 4.806713259859531 52.11808327571072, 4.805608147820809 52.11856102711491, 4.819366745114616 52.12916174862249, 4.820391627911995 52.12882844174937, 4.825146482688536 52.13155708895362, 4.836760218799797 52.1320950542045, 4.839831083487208 52.13138455359988, 4.841855268314998 52.13279519337573, 4.844997575437689 52.13266472167823, 4.851613567129445 52.13095545048285, 4.850995342194573 52.13013121164453, 4.855100260574258 52.12826534499285, 4.858115526952704 52.1255730225948, 4.857260037781153 52.12489270966972, 4.857432505687366 52.12358885970951, 4.856966250193945 52.12318812892995, 4.857412305450096 52.12198214729695, 4.855523610331791 52.12072942129434, 4.855459491604404 52.1195211452892, 4.856410703395785 52.11874023894567, 4.857189725526387 52.11758407511068, 4.857006548770007 52.11648398314836, 4.858161027579516 52.11509998252357, 4.860588442243921 52.11558196309642, 4.862378153957152 52.11356052316284, 4.863167486792669 52.11317747763539, 4.862651303280372 52.11034849069802, 4.864831936661076 52.10842539029259, 4.864544590469517 52.1078322025319, 4.866034352158711 52.1062563318614, 4.867314973640948 52.10409968552982, 4.86967559135546 52.10353023647684, 4.865590360499596 52.09723068553979, 4.86211402445756 52.09595894201262, 4.861573683244572 52.09520757940017, 4.852430695728541 52.09876627241331, 4.846469734862426 52.10185569966663, 4.842415244351158 52.10297254568547, 4.837985745856069 52.10266207609867, 4.832555777932917 52.10394128701714, 4.831113012822775 52.10480424504518, 4.829541164175933 52.10500217933986, 4.82775049958501 52.10544065304562, 4.824631499045423 52.10542581163859, 4.825548195162908 52.10741128945562, 4.804847821873415 52.11667280734238))',
    // };
    // const geom = parameters.geom;
    
    const response = await fetch(
      `${url}${uuid}/zonal?geom=${geom}&zonal_statistic=mean&pixel_size=10&zonal_projection=EPSG:28992`,
      {
        method: 'GET',
        // body: JSON.stringify({parameters}),
        headers: {'Content-Type': 'application/json'}
      }
    );
    const responseJson = await response.json();

    console.log('responseJson', responseJson);
    // uuid = "8480a74a-ab21-43bc-a1e0-41d38467bc65" #	Fveg - Hittestress.nu
    // raster_url = "https://nens.lizard.net/api/v4/rasters/"
    // get_url = f"{raster_url}{uuid}/zonal/"

    // r = requests.get(
    //             url=get_url,
    //             headers=headers,
    //             params=
    //             {"geom": geom,
    //                   "zonal_statistic": "mean",
    //                   "pixel_size": "10",
    //                   "zonal_projection":"EPSG:28992", #projection to perform the aggregation in
    //             }
    // )
    // r.json()
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
    if (wms1Loaded && wms2Loaded && wms3Loaded && docRequested) {
      // add extra timeout for wms to properly visualize ?! If I don't do this I get half transparent wms..
      // comment out temporarily for dev
      window.setTimeout(()=>{
        openAsDocumentInNewWindow();
        setDocRequested(false);
        setwms1Loaded(false);
        setwms2Loaded(false);
        setwms3Loaded(false);
      },3000);
      
    }
  }, [wms1Loaded,wms2Loaded,wms3Loaded, docRequested]);

  fetchChartData();
  fetchMean();

  return (
    <Block
      title="Export"
      icon={<DownloadIcon/>}
      status={ !changesMade ? "disabled" : openBlock === 'report' ? "opened" :  "closed"} // docRequested ||
      onOpen={()=>{
        clickBlockReport();
        // addMessage("Export document aangevraagd");
        // setDocRequested(true);
      }}
      // alsoRenderChildrenIfClosed={true}
    >

      <IconRow>
        {editingReportPolygon ?
         <CloseUndoCheckBar
           onClose={cancelEditingReportPolygon}
           onUndo={undoEditingReportPolygon}
           onCheck={submitEditingReportPolygon}
         />
        :
         <TextButton text="Teken op kaart" 
            icon={<Pencil/>}
            onClick={()=>{
              console.log("startEditingReportPolygon"); 
              startEditingReportPolygon();
            }} 
        />
        }
      </IconRow>


      <div style={{visibility: "hidden"}}>
      <IconRow>
        
        <button 
          onClick={()=>{
            openAsDocumentInNewWindow();
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

            `}</style>
            <div
              className="noprint"
            >
              {"Settings >> Print >> Print as pdf"} 
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
                      layers={mapState.templatedLayer!}
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
                  </div>
                  </div>

               
            <h1 className="new_page">Hittestress PET rapport</h1>
            <h2> Verdeling gevoelstemperatuur</h2>
            <hr></hr>
            <div 
                    className="two_column_row"
                  >
                    <div>
                    
                    <h1>Todo Bar chart temperature</h1>
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
                height: 100px;
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
            <hr></hr>
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
      </div>
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
