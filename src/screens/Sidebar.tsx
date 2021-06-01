import React from 'react';

import BlockHittestress from './BlockHittestress';
import BlockPavements from './BlockPavements';
import BlockTrees from './BlockTrees';
import BlockCalculate from './BlockCalculate';
import ExportDoc from './ExportDoc';
import ExportGeoJson from './ExportGeoJson';
import ImportGeoJson from './ImportGeoJson';
import Header from '../components/Header';

const Sidebar: React.FC = () => {

  return (
    <div
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
    >
      <Header/>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2>Resultaat</h2>
          <BlockHittestress/>
          <h2>Maatregelen</h2>
          <BlockTrees/>
          <BlockPavements/>
        </div>
        <div>
          <BlockCalculate/>
          <ImportGeoJson/>
          <ExportGeoJson/>
          <ExportDoc/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
