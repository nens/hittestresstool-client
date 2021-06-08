import React from 'react';

import { connect, useSelector } from 'react-redux';

import Block from '../components/Block';
import Heat from '../icons/Heat';
import {
  getEditing,
  getHeatstressUpdated,
  clickHeatStress,
  getReportRequested,
} from '../state/sidebar';

interface Props {
  clickHeatStress: () => void
}

const BlockHittestress: React.FC<Props> = ({clickHeatStress}) => {
  const editing = useSelector(getEditing);
  const heatstressUpdated = useSelector(getHeatstressUpdated);
  const reportRequested = useSelector(getReportRequested);


  return (
    <Block
      title={<>
        <span>Hittestresskaart</span>
        {heatstressUpdated ? <span style={{
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
      status={editing || reportRequested ? "disabled" : "closed"}
      onOpen={clickHeatStress} />
  );
};

export default connect(null, {clickHeatStress})(BlockHittestress);
