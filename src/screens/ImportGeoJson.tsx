import React  from 'react';
import { connect, useSelector, } from 'react-redux';
import Block from '../components/Block';
import UploadIcon from '../icons/Upload';
 import {
  addReportPolygonFeaturesList,
  ReportPolygonOnMap,
 } from '../state/reportPolygons';
import {
  addTreesFeaturesList,
} from '../state/trees';
import {
  Tree,
  getReportRequested,
} from '../state/sidebar';
import {
  addPavementFeaturesList,
  PavementsOnMap,
} from '../state/pavements';
import {
  addMessage,
} from '../state/message';
import {
  setChangesMade
} from '../state/sidebar';


interface Props {
  addMessage: (message: string) => void,
  addTreesFeaturesList: (trees: Tree[]) => void,
  addPavementFeaturesList: (pavements: PavementsOnMap[]) => void,
  addReportPolygonFeaturesList: (reportPolygons: ReportPolygonOnMap[]) => void,
  setChangesMade: () => void,
}




const ImportGeoJson: React.FC<Props> = ({  
  addMessage,
  addTreesFeaturesList,
  addPavementFeaturesList,
  addReportPolygonFeaturesList,
  setChangesMade,
}) => {
  const reportRequested = useSelector(getReportRequested)
  
  return (
    <Block
      title="Import GeoJSON"
      icon={<UploadIcon/>}
      status={reportRequested? "disabled":"closed"} 
      onOpen={()=>{
        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => { 

          // getting a hold of the file reference
          // @ts-ignore
          const file = e.target.files[0]; 
       
          // setting up the reader
          var reader = new FileReader();
          reader.readAsText(file,'UTF-8');
       
          // here we tell the reader what to do when it's done reading...
          reader.onload = readerEvent => {
            // @ts-ignore
             var content = readerEvent.target.result; // this is the content!
             let geoJson = null;
             try {
              // @ts-ignore 
              geoJson = JSON.parse(content);
             } catch(e){
               console.error(e);
               addMessage("Failed to parse GeoJSON ! ")
             }
             const trees =  (geoJson.features && geoJson.features.length && geoJson.features.filter((item:any)=>{
                if (
                  item.geometry.type === "Point" && 
                  item.properties.tree
                ) {
                  return true;
                } else {
                  return false;
                }
             })) || [];
             const pavements =  (geoJson.features && geoJson.features.length && geoJson.features.filter((item:any)=>{
                if (
                  item.geometry.type === "Polygon" && 
                  item.properties.pavement
                ) {
                  return true;
                } else {
                  return false;
                }
            })) || [];
            const reportPolygons =  (geoJson.features && geoJson.features.length && geoJson.features.filter((item:any)=>{
              if (
                item.geometry.type === "Polygon" && 
                !item.properties.pavement
              ) {
                return true;
              } else {
                return false;
              }
            })) || [];
            addTreesFeaturesList(trees);
            addPavementFeaturesList(pavements);
            addReportPolygonFeaturesList(reportPolygons);
            setChangesMade();
          }
       
       }

        input.click();
      }}
    >
    </Block>
  );
};

export default connect(null, {
  addMessage,
  addTreesFeaturesList,
  addPavementFeaturesList,
  addReportPolygonFeaturesList,
  setChangesMade,
})(ImportGeoJson);
