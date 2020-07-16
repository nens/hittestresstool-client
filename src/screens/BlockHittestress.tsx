import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block from '../components/Block';
import Heat from '../icons/Heat';
import { getEditing, clickHeatStress } from '../state/sidebar';

interface Props {
  clickHeatStress: () => void
}

const BlockHittestress: React.FC<Props> = ({clickHeatStress}) => {
  const editing = useSelector(getEditing);

  return (
    <Block title="Hittestress" icon={<Heat/>} status={editing ? "disabled" : "closed"}
           onOpen={clickHeatStress} />
  );
};

export default connect(null, {clickHeatStress})(BlockHittestress);
