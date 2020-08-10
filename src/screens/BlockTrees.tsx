import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block, { IconRow } from '../components/Block';
import TextButton from '../components/TextButton';
import Slider from '../components/Slider';

import FarmingAndGardening from '../icons/FarmingAndGardening';
import Tree from '../icons/Tree';

import { getEditing, getOpenBlock, clickBlockTrees } from '../state/sidebar';

interface Props {
  clickBlockTrees: () => void
}

const BlockTrees: React.FC<Props> = ({clickBlockTrees}) => {
  const editing = useSelector(getEditing);
  const openBlock = useSelector(getOpenBlock);

  const status = openBlock === 'trees' ? "opened" : editing ? "disabled" : "closed";

  return (
    <Block title="Bomen planten" icon={<Tree/>} status={status}
           onOpen={clickBlockTrees}>
      <IconRow>
        <Tree size="small" /> <Slider amount={3} current={1} /> <Tree size="large" />
      </IconRow>
      <IconRow>
        <TextButton text="Plant op kaart" icon={<FarmingAndGardening/>}
        onClick={() => {}} />
      </IconRow>
    </Block>
  );
};

export default connect(null, {clickBlockTrees})(BlockTrees);
