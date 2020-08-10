import React from 'react';

import { Pavement } from '../state/sidebar';
import styles from "./Block.module.css";

import { IconRow } from './Block';

import Sea from '../icons/Sea';
import Grass from '../icons/Grass';
import Botanical from '../icons/Botanical';
import Brick from '../icons/Brick';
import Road from '../icons/Road';

interface Props {
  active: Pavement,
  setActive: (pavement: Pavement) => void
}

const PavementIcons: React.FC<Props> = ({active, setActive}) => {
  return (
    <div className={styles.sidebarBlockRow}>
      <Sea active={active === "water"} onClick={() => setActive("water")}/>
      <Grass active={active === "grass"} onClick={() => setActive("grass")}/>
      <Botanical active={active === "shrub"} onClick={() => setActive("shrub")}/>
      <Brick active={active === "semipaved"} onClick={() => setActive("semipaved")}/>
      <Road active={active === "paved"} onClick={() => setActive("paved")}/>
    </div>
  );
};

export default PavementIcons;
