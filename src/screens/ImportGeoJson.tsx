import React  from 'react';
import { connect, useSelector,  } from 'react-redux';
import Block from '../components/Block';
import UploadIcon from '../icons/Upload';
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




const ImportGeoJson: React.FC<Props> = () => {

  
  return (
    <Block
      title="Import GeoJSON"
      icon={<UploadIcon/>}
      status={"closed"} 
      onClick={()=>{
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
             console.log( content );
          }
       
       }

        input.click();
      }}
    >
    </Block>
  );
};

export default connect(null, {
})(ImportGeoJson);
