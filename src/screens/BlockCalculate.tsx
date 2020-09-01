import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block from '../components/Block';
import Reload from '../icons/Reload';
import {
  getEditing,
  getChangesMade
} from '../state/sidebar';
import {
  clickCalculate
} from '../state/map';

interface Props {
  clickCalculate: () => void
}

const BlockCalculate: React.FC<Props> = ({clickCalculate}) => {
  const editing = useSelector(getEditing);
  const changesMade = useSelector(getChangesMade);

  return (
    <Block
      title={
        <span>Update hittestress</span>
      }
      icon={<Reload/>}
      status={editing || !changesMade ? "disabled" : "closed"}
      onOpen={clickCalculate} />
  );
};

export default connect(null, {clickCalculate})(BlockCalculate);
