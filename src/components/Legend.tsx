import React, { useState, useEffect } from 'react';

import styles from './Legend.module.css';

interface LegendProps {
  wmsServer: string;
  style: string;
  numSteps: number;
}

interface Step {
  value: number;
  color: string;
}

function Legend (props: LegendProps) {
  const {wmsServer, style, numSteps} = props;

  const [steps, setSteps] = useState<Step[] | null>(null);

  useEffect(() => {
    fetch(`${wmsServer}/?service=WMS&request=GetLegend&style=${style}&steps=${numSteps}&format=json`).then(
      (response) => response.json()).then(
        (json) => setSteps(json.legend as Step[]));
  }, [style, steps]);

  return (
    <div className={styles.Legend}>
      {steps !== null && steps.map((step) => (
        <div className={styles.Color} style={{background: step.color}}></div>
      ))}
    </div>
  );
}

export default Legend;
