import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block from '../components/Block';
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
           onOpen={clickBlockTrees} />
  );
};

export default connect(null, {clickBlockTrees})(BlockTrees);
