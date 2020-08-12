import React from 'react';

import styles from './Slider.module.css';

export interface SliderProps {
  amount: number,
  current: number,
  onChange?: (arg0: number) => void
}

export default function Slider ({amount, current, onChange}: SliderProps) {
  if (!amount) return null;

  const elements = (new Array(amount * 2 -1)).fill(0);
  return (
    <div className={styles.Slider}>
      {elements.map((_, idx) => {
        const active = Math.ceil(idx/2) <= current;
        if (!(idx % 2)) {
          // Draw circle
          return (
            <div
              className={active ? styles.SliderBulletActive : styles.SliderBullet}
              key={`bullet-${idx}`}
              onClick={() => onChange && onChange(idx/2)}
            >
            </div>
          );
        } else {
          // Draw line
          return (
            <div className={active ? styles.SliderLineActive : styles.SliderLine} key={`line-${idx}`}>
            </div>
          );
        }
      })}
    </div>
  );
}
