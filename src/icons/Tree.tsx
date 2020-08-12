import React from 'react';

export type TreeSize = "small" | "default" | "large";

interface TreeProps {
  size?: TreeSize
}

export function treeScaleFactor(size: TreeSize) {
  let factor = 1;

  if (size === 'small') {
    factor = 0.75;
  } else if (size === 'large') {
    factor = 1.5;
  }

  return factor;
}

const Tree: React.FC<TreeProps> = ({size='default'}: TreeProps) => {
  const width = 22.349;
  const height = 32;

  const remHeight = height / 16;

  const factor = treeScaleFactor(size);
  const margin = (3 - factor*remHeight)/2 + 'rem';

  return (
    <svg style={size ? {marginTop: margin, marginBottom: margin} : {}} xmlns="http://www.w3.org/2000/svg" width={width * factor} height={height * factor} viewBox="0 0 22.349 32"><path style={{fill: "#afd755"}} d="M97.96,11.768h0A5.835,5.835,0,0,0,93.207,2.54c-.048,0-.094.006-.142.007a5.582,5.582,0,0,0-9.788.773,8.108,8.108,0,0,0-4,13.256c-.022.228-.035.459-.035.694a7.111,7.111,0,0,0,7.111,7.111c.428,0,2.133-.038,2.54-.111l.172-1.76a7.11,7.11,0,0,0,8.9-10.742Z" transform="translate(-77.207)"/><path style={{fill: "#96be4b"}} d="M88.89,21.708a3.837,3.837,0,0,1-2.682-.252,4.127,4.127,0,0,1-2.381-3.31A4.062,4.062,0,0,1,84,16.537.5.5,0,0,0,83.826,16a5.576,5.576,0,0,1,1.225-9.4.511.511,0,0,0,.309-.512,4.991,4.991,0,0,1-.027-.5A5.585,5.585,0,0,1,89.646.152,5.544,5.544,0,0,0,83.278,3.32a8.108,8.108,0,0,0-4,13.256c-.022.228-.035.459-.035.694a7.111,7.111,0,0,0,7.111,7.111c.428,0,2.133-.038,2.54-.111V21.708h0Z" transform="translate(-77.207)"/><path style={{fill: "#af6e5a"}} d="M240.255,345.137l-.048,0-.46,9.653h3.048l-.45-9.445a.508.508,0,0,0-.672-.463A4.019,4.019,0,0,1,240.255,345.137Z" transform="translate(-229.588 -323.296)"/><path style={{fill: "#965a50"}} d="M242.345,345.342a.508.508,0,0,0-.672-.463,4.02,4.02,0,0,1-1.418.258l-.048,0-.46,9.653h1.524v-8.269a.508.508,0,0,1,.347-.482l.748-.249Z" transform="translate(-229.588 -323.296)"/><path style={{fill: "#96be4b"}} d="M220.953,496.762h-5.079a.508.508,0,0,1,0-1.016h5.079a.508.508,0,1,1,0,1.016Z" transform="translate(-206.731 -464.762)"/></svg>
  );
};

export default Tree;
