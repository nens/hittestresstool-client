import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block from '../components/Block';
import Heat from '../icons/Heat';
import {
  getEditing,
  getHeatstressUpdated,
  clickHeatStress
} from '../state/sidebar';

interface Props {
  clickHeatStress: () => void
}

const BlockHittestress: React.FC<Props> = ({clickHeatStress}) => {
  const editing = useSelector(getEditing);
  const heatstressUpdated = useSelector(getHeatstressUpdated);

  return (
    <Block
      title={<>
        <span>Hittestress</span>
        {heatstressUpdated || true ? <span style={{
          display: "inline-block",
          textAlign: "center",
          verticalAlign: "middle",
          background: "#D93434",
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "0.75rem",
          marginLeft: "0.5rem"
        }}>!</span> : null}
      </>
      }
      icon={<Heat/>}
      status={editing ? "disabled" : "closed"}
      onOpen={clickHeatStress} />
  );
};

export default connect(null, {clickHeatStress})(BlockHittestress);
