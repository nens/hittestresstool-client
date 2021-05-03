import React from 'react';

import BlockHittestress from './BlockHittestress';
import BlockPavements from './BlockPavements';
import BlockTrees from './BlockTrees';
import BlockCalculate from './BlockCalculate';
import ExportDoc from './ExportDoc';
import ExportGeoJson from './ExportGeoJson';

const Sidebar: React.FC = () => {

  return (
    <div>
      <h1>Hittestresstool</h1>
      <h2>Resultaat</h2>
      <BlockHittestress/>
      <h2>Brondata</h2>
      <BlockTrees/>
      <BlockPavements/>
      <BlockCalculate/>
      <ExportGeoJson/>
      <ExportDoc/>
    </div>
  );
};

export default Sidebar;
