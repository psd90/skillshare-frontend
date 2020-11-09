import React from "react";
import app from "../base";
import FontSize from "./font-size";

const Header = () => {
  return (
    <header className="header">
      <FontSize />
      <h1>SkllShr</h1>
      <button className="signOut" onClick={() => app.auth().signOut()}>
        Sign Out
      </button>
    </header>
  );
};

export default Header;
