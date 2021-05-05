import React from 'react';

import BlockHittestress from './BlockHittestress';
import BlockPavements from './BlockPavements';
import BlockTrees from './BlockTrees';
import BlockCalculate from './BlockCalculate';
import ExportDoc from './ExportDoc';
import ExportGeoJson from './ExportGeoJson';
import ImportGeoJson from './ImportGeoJson';
import packageJson from '../../package.json';

const Sidebar: React.FC = () => {

  return (
    <div>
      <h1 title={"client-version: " +packageJson.version}>Hittestresstool</h1>
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
