import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block, { IconRow } from '../components/Block';
import CloseUndoCheckBar from '../components/CloseUndoCheckBar';
import TextButton from '../components/TextButton';
import Slider from '../components/Slider';

import FarmingAndGardening from '../icons/FarmingAndGardening';
import Tree from '../icons/Tree';

import {
  Tree as TreeT,
  TREES,
  getEditing,
  getOpenBlock,
  clickBlockTrees,
  getSelectedTree,
  setSelectedTree,
  startEditingTrees,
  cancelEditingTrees,
  submitEditingTrees,
  undoEditingTrees,
  getReportRequested,
} from '../state/sidebar';

interface Props {
  clickBlockTrees: () => void,
  setSelectedTree: (arg0: TreeT) => void,
  startEditingTrees: () => void,
  cancelEditingTrees: () => void,
  undoEditingTrees: () => void,
  submitEditingTrees: () => void,
}

const BlockTrees: React.FC<Props> = ({
  clickBlockTrees,
  setSelectedTree,
  startEditingTrees,
  cancelEditingTrees,
  submitEditingTrees,
  undoEditingTrees,
}) => {
  const editing = useSelector(getEditing);
  const openBlock = useSelector(getOpenBlock);
  const selectedTree = useSelector(getSelectedTree);
  const reportRequested = useSelector(getReportRequested);


  const blockStatus = openBlock === 'trees' ? "opened" : editing || reportRequested ? "disabled" : "closed";
  const editingTrees = openBlock === 'trees' && editing;

  // Functions to convert indexes 0, 1, 2 to Tree types
  const idxToTree = (idx: number): TreeT => (TREES[idx] || "tree_5m");
  const treeToIdx = (t: TreeT) => {
    return {
      "tree_5m": 0,
      "tree_10m": 1,
      "tree_15m": 2
    }[t];
  };

  return (
    <Block
      title="Bomen planten"
      icon={<Tree/>}
      status={blockStatus}
      onOpen={clickBlockTrees}
    >
      <IconRow>
        <Tree size="small" />
        <Slider
          amount={TREES.length}
          current={treeToIdx(selectedTree)}
          onChange={(t: number) => setSelectedTree(idxToTree(t))}
        />
        <Tree size="large" />
      </IconRow>
      <IconRow>
        {editingTrees ?
         <CloseUndoCheckBar
           onClose={cancelEditingTrees}
           onUndo={undoEditingTrees}
           onCheck={submitEditingTrees}
         />
        :
         <TextButton
           text="Plant op kaart"
           icon={<FarmingAndGardening/>}
           onClick={startEditingTrees}
         />
        }
      </IconRow>
    </Block>
  );
};

export default connect(null, {
  clickBlockTrees,
  setSelectedTree,
  startEditingTrees,
  cancelEditingTrees,
  submitEditingTrees,
  undoEditingTrees
})(BlockTrees);
