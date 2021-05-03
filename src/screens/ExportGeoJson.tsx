import React  from 'react';
import { connect, useSelector,  } from 'react-redux';
import Block from '../components/Block';
import DownloadIcon from '../icons/Download';
import {
  addMessage,
} from '../state/message';
 import {
  getReportPolygonsOnMap,
 } from '../state/reportPolygons';
import {
  getTreesOnMap,
} from '../state/trees';
import {
  getPavementsOnMap,
} from '../state/pavements';


interface Props {
  addMessage: (message: string) => void,
}

const ExportDoc: React.FC<Props> = ({
  addMessage,
}) => {

  const treesOnMap = useSelector(getTreesOnMap);
  const pavementsOnMap = useSelector(getPavementsOnMap);
  const reportPolygonsOnMap = useSelector(getReportPolygonsOnMap);

  console.log( "geojson", treesOnMap, pavementsOnMap, reportPolygonsOnMap );
  
  // const completeGeoJson = 

 


    
  return (
    <Block
      title="Export as GeoJSON"
      icon={<DownloadIcon/>}
      status={"closed"} 
      onClick={()=>{
        console.log('clicked');
      }}
    >

     
    </Block>
  );
};

export default connect(null, {
  addMessage,  
})(ExportDoc);
