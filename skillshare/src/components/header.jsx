import React from "react";
import app from "../base";
import FontSize from "./font-size";
import PropTypes from "prop-types"

const Header = (props) => {  
  return (
    <header className="header">
      <FontSize />
      <h1>SkllShr</h1>
      <button className="signOut" onClick={() => {
        if (props.destroySession) props.destroySession()
        app.auth().signOut()}}>
        Sign Out
      </button>
    </header>
  );
};
    Header.propTypes = {
      destroySession : PropTypes.func
    }

export default Header;
