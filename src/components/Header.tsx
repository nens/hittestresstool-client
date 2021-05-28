import React from 'react';

import packageJson from '../../package.json';

const Header: React.FC = () => {

  return (
   
      <h1 
        title={"client-version: " +packageJson.version}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Hittestresstool</span>
        <a
          style={{
            backgroundColor: "white",
            color: "#6DC1A9",
            fontSize: "29px",
            textDecoration: "none",
            borderRadius: "18px",
            width: "36px",
            height: "36px",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          href={process.env.PUBLIC_URL + "/20201211 - Gebruiksaanwijzing hittetool.pdf"}
          target="_blank"
          rel="noopener noreferrer"
        >i</a>
      </h1>
  );
};

export default Header;
