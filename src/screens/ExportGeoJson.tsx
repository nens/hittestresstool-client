import React  from 'react';
import { connect, useSelector,  } from 'react-redux';
import Block from '../components/Block';
import DownloadIcon from '../icons/Download';
 import {
  getReportPolygonsOnMap,
 } from '../state/reportPolygons';
import {
  getTreesOnMap,
} from '../state/trees';
import {
  getPavementsOnMap,
} from '../state/pavements';


interface Props {}

const download = (filename: string, text: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}


const ExportGeoJson: React.FC<Props> = () => {
  const treesOnMap = useSelector(getTreesOnMap);
  const pavementsOnMap = useSelector(getPavementsOnMap);
  const reportPolygonsOnMap = useSelector(getReportPolygonsOnMap);
  
  const completeGeoJson = {
    type: "FeatureCollection",
    // @ts-ignore 
    features: [].concat(treesOnMap.features).concat(pavementsOnMap.features).concat(reportPolygonsOnMap.features)
  }

 


    
  return (
    <Block
      title="Maatregelen opslaan"
      icon={<DownloadIcon/>}
      status={"closed"} 
      onOpen={()=>{
        download("Hittestress_GeoJSON.txt", JSON.stringify(completeGeoJson, null, "    "));
      }}
    >
    </Block>
  );
};

export default connect(null, {
})(ExportGeoJson);
