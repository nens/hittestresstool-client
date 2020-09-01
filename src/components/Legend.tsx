import React from 'react';

import { LegendStep } from '../state/session';

import styles from './Legend.module.css';

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
    <div className={styles.Legend}>
      <div className={styles.Steps}>
        {steps.map((step) => (
          <div className={styles.Color} style={{background: step.color}}></div>
        ))}
      </div>
      <div className={styles.Temperatures}>
        <div className={styles.HighTemp}>{high === null ? "max" : (<span>{high}&deg;C</span>)}</div>
        <div className={styles.LowTemp}>{low === null ? "min" : (<span>{low}&deg;C</span>)}</div>
      </div>
    </div>
  );
}

export default Legend;
