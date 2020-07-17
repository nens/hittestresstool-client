import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block, { IconRow } from '../components/Block';
import Land from '../icons/Land';
import Sea from '../icons/Sea';
import Grass from '../icons/Grass';
import Botanical from '../icons/Botanical';
import Brick from '../icons/Brick';
import Road from '../icons/Road';
import Close from '../icons/Close';
import Return from '../icons/Return';
import Check from '../icons/Check';

import { getEditing, getOpenBlock, clickBlockPavements } from '../state/sidebar';

interface Props {
  clickBlockPavements: () => void
}

const BlockPavements: React.FC<Props> = ({clickBlockPavements}) => {
  const editing = useSelector(getEditing);
  const openBlock = useSelector(getOpenBlock);

  const status = openBlock === 'pavements' ? "opened" : editing ? "disabled" : "closed";

  return (
    <Block title="Verharding aanpassen" icon={<Land/>} status={status}
           onOpen={clickBlockPavements}>
    <IconRow> <Sea/> <Grass active={true} /> <Botanical/> <Brick/> <Road/> </IconRow>
    <IconRow> <Close/> <Return/> <Check/> </IconRow>
    </Block>
  );
};

export default connect(null, {clickBlockPavements})(BlockPavements);
