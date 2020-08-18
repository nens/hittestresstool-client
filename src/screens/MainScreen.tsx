import React from 'react';

import Sidebar from './Sidebar';
import MainMap from './MainMap';

import styles from './MainScreen.module.css';

import CompareImageSlider from './CompareImageSlider';

const MainScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftBar}>
        <Sidebar />
      </div>
      <div className={styles.map}>
        <MainMap />
        <CompareImageSlider />
      </div>
    </div>
  );
};

export default MainScreen;
