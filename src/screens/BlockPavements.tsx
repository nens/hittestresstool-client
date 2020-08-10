import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block, { IconRow } from '../components/Block';
import TextButton from '../components/TextButton';
import PavementIcons from '../components/PavementIcons';
import Land from '../icons/Land';
import Close from '../icons/Close';
import Return from '../icons/Return';
import Check from '../icons/Check';
import Pencil from '../icons/Pencil';

import {
  Pavement,
  getEditing,
  getOpenBlock,
  clickBlockPavements,
  getSelectedPavement,
  setSelectedPavement,
} from '../state/sidebar';

interface Props {
  clickBlockPavements: () => void,
  setSelectedPavement: (pavement: Pavement) => void
}

const BlockPavements: React.FC<Props> = ({clickBlockPavements, setSelectedPavement}) => {
  const editing = useSelector(getEditing);
  const openBlock = useSelector(getOpenBlock);
  const selectedPavement = useSelector(getSelectedPavement);

  const status = openBlock === 'pavements' ? "opened" : editing ? "disabled" : "closed";

  return (
    <Block title="Verharding aanpassen" icon={<Land/>} status={status}
           onOpen={clickBlockPavements}>
      <PavementIcons active={selectedPavement} setActive={setSelectedPavement} />
      <IconRow>
        <TextButton text="Teken op kaart" icon={<Pencil/>}
                    onClick={() => {}} />
      </IconRow>
    </Block>
  );
};

export default connect(null, {clickBlockPavements, setSelectedPavement})(BlockPavements);
