import React from 'react';

import BlockHittestress from './BlockHittestress';
import BlockPavements from './BlockPavements';
import BlockTrees from './BlockTrees';
import BlockCalculate from './BlockCalculate';
import ExportDoc from './ExportDoc';
import ExportGeoJson from './ExportGeoJson';
import ImportGeoJson from './ImportGeoJson';
import packageJson from '../../package.json';
import center from '@turf/center';

const Sidebar: React.FC = () => {

  return (
    <div>
      <h1 
        title={"client-version: " +packageJson.version}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Hittestresstool</span>
        <button
          style={{
            backgroundColor: "white",
            color: "#6DC1A9",
            fontSize: "29px",
            borderRadius: "18px",
            width: "36px",
            height: "36px",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >i</button>
      </h1>
      <h2>Resultaat</h2>
      <BlockHittestress/>
      <h2>Brondata</h2>
      <BlockTrees/>
      <BlockPavements/>
      <ImportGeoJson/>
      <BlockCalculate/>
      <ExportGeoJson/>
      <ExportDoc/>
    </div>
  );
};

export default Sidebar;
