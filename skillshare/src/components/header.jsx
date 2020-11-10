import React from "react";
import app from "../base";
import FontSize from "./font-size";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <FontSize />
      <Link to="/">
        <h1 className="skllshrTitle">SkllShr</h1>
      </Link>
      <button className="signOut" onClick={() => app.auth().signOut()}>
        Sign Out
      </button>
    </header>
  );
};

export default Header;
