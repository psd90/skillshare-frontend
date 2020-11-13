import React, { useContext } from "react";
import app from "../base";
import FontSize from "./font-size";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Auth";
import { contextType } from "react-image-crop";
import Axios from "axios";
import PropTypes from "prop-types";

const Header = (props) => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  return (
    <header className="header">
      <div className="headerPositioning">
        <FontSize />
        <Link id="link" to="/">
          <h1 className="skllshrTitle">SkllShr</h1>
        </Link>
      </div>
      <input type="checkbox" className="nav-toggle" id="nav-toggle"></input>
      <nav>
        <ul>
          <li
            onClick={() => {
              Axios.get(
                `https://firebasing-testing.firebaseio.com/users/${currentUser.uid}.json`
              ).then((user) => {
                if (props.updateUser) {
                  history.push(`/profile/${user.data.username}`);
                  props.updateUser(currentUser.uid, user.data);
                } else {
                  history.push(`/profile/${user.data.username}`);
                }
              });
            }}
          >
            <a href="#">My Profile</a>
          </li>
          <li
            onClick={() => {
              Axios.get(
                `https://firebasing-testing.firebaseio.com/users/${currentUser.uid}.json`
              ).then((user) => {
                history.push(`/${user.data.username}/messages`);
              });
            }}
          >
            <a href="#">Messages</a>
          </li>
          <li onClick={() => app.auth().signOut()}>
            <a href="">Sign Out</a>
          </li>
        </ul>
      </nav>
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        <span>
          <div className="profileIconContainer">
            <FontAwesomeIcon className="profileIcon" icon={faUserCircle} />
          </div>
        </span>
      </label>
    </header>
  );
};

Header.propTypes = {
  history: PropTypes.node,
  updateUser: PropTypes.func,
};

export default Header;
