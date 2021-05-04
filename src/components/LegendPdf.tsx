// Copy from Legend.tsx but with styles inline so it can be used for PDF export

import React from 'react';

import { LegendStep } from '../state/session';


interface LegendProps {
  steps: LegendStep[];
  style: string;
}

function Legend (props: LegendProps) {
  const {steps, style} = props;

  let low: string | null = null;
  let high: string | null = null;

  const styleParts = style.split(":");
  if (styleParts.length === 3) {
    low = styleParts[1];
    high = styleParts[2];
  }

  return (
    <div 
      style={{
        background: "#5A5152",
        boxShadow: "3px 3px 6px #00000029",
        borderRadius: "3px",
        width: "3.5rem",
        height: "6.5rem",
        padding: "0.5rem",
        zIndex: 1000,
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
      }}
    >
      <div 
        style={{
          width: "2rem",
          height: "6.5rem",
          float: "left",
        }}
      >
        {steps.map((step, i) => (
          <div key={`legendstep-${i}`} 
            style={{
              background: step.color,
              width: "1.5rem",
              height: "0.1rem",
            }}
          ></div>
        ))}
      </div>
      <div 
        style={{
          position: "relative",
          color: "white",
          width: "1.5rem",
          height: "6.5rem",
          float: "left",
          textAlign: "right",
        }}
      >
        <div 
          style={{
            borderTop: "solid white 1px",
            width: "100%",
          }}
        >{high === null ? "max" : (<span>{high}&deg;C</span>)}</div>
        <div 
          style={{
            position: "absolute",
            borderBottom: "solid white 1px",
            width: "100%",
            bottom: 0,
          }}
        >{low === null ? "min" : (<span>{low}&deg;C</span>)}</div>
      </div>
    </div>
  );
}

export default Legend;
