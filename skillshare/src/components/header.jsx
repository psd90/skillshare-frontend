import React from "react";
import app from "../base";
import FontSize from "./font-size";

const Header = () => {
  return (
    <header className="header">
      <FontSize />
      <h1>Skill share</h1>
      <button id="signout" onClick={() => app.auth().signOut()}>
        sign out
      </button>
    </header>
  );
};

export default Header;
