import React from "react";
import app from "../base";
import FontSize from "./font-size";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DropdownMenu from './dropdown'

const Header = () => {
  return (
    <header className="header">
      
      <FontSize />
      <Link  id='link' to="/">
        <h1 className="skllshrTitle">SkllShr</h1>
      </Link>
      {/* <Link to='/'>
      <button className="signOut" onClick={() => app.auth().signOut()}>
        Sign Out
      </button>
      </Link> */}
      <DropdownMenu/>
    </header>
  );
};

export default Header;
