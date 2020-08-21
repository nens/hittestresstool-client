import React from 'react';
import { useSelector } from 'react-redux';

import { showSlider } from '../state/map';

import CompareImageSlider from './CompareImageSlider';
import MainMap from './MainMap';
import Sidebar from './Sidebar';

import styles from './MainScreen.module.css';

const MainScreen: React.FC = () => {
  const doShowSlider = useSelector(showSlider);
  return (
    <div className={styles.container}>
      <div className={styles.leftBar}>
        <Sidebar />
      </div>
      <div className={styles.map}>
        <MainMap />
        {doShowSlider && <CompareImageSlider />}
      </div>
    </div>
  );
};

export default MainScreen;
