import React from 'react';

import BlockHittestress from './BlockHittestress';
import BlockPavements from './BlockPavements';
import BlockTrees from './BlockTrees';
import BlockCalculate from './BlockCalculate';
import ExportDoc from './ExportDoc';
import Plot from 'react-plotly.js';

const Sidebar: React.FC = () => {

  // const histogramData = [0.4345888090630087,0.448979184606885,0.8380149785637945,1.081394824354905,1.517011387814018,1.3858442223784695,1.756905100722363,2.3005959134334537,2.3000193945352416,8.601274674012293,11.0264098832167,9.537856339138495,9.035169393243816,11.57003884337166,9.499371157231469,11.585965614619735,8.39771296842648,5.94631395064603,2.3283652843672202,0.40816807625396273]
  return (
    <div>
      {/* <div
        style={{
          position: "fixed",
          zIndex: 9999,
          width: "1000px",
          display: "none",
        }}
      >
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10mm",
          }}
        >
          <div>

          
        <Plot
          data={[
            {
              type: 'bar', 
              x: histogramData.map((item:number, ind:number)=>ind), 
              y: histogramData.map((value:number)=>value), 
              marker: {color: 'blue'},
              name: "Huidige projectlocatie"
            },
            {
              type: 'bar', 
              x: histogramData.map((item:number,ind:number)=>ind), 
              y: histogramData.map((value:number)=>value), 
              marker: {color: 'red'},
              name: "Ontwerp projectlocatie"
            },
          ]}
          layout={ {
            width: 400, 
            height: 300, 
            // autosize: false,
            margin: {
              l: 30,
              r: 10,
              b: 30,
              // t: 20,
              // pad: 5
            },
            title: 'Distributie gevoelstemperatuur',
            // displayodeBar: false,
            
            showlegend: true,
            legend: {
              // the x 1 is somehow needed to move the legend to the right. No idea why
              // x: 1,
              xanchor: 'right',
              // the y 100 is done to move the legend up to above the chart
              y: 100
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
          }}
          config={{
            displayModeBar: false,
          }}
        />
        </div>
          <div>

          </div>
        </div>
      </div> */}

      <h1>Hittestresstool</h1>
      <h2>Resultaat</h2>
      <BlockHittestress/>
      <h2>Brondata</h2>
      <BlockTrees/>
      <BlockPavements/>
      <BlockCalculate/>
      <ExportDoc/>
    </div>
  );
};

export default Sidebar;
