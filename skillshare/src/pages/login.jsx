import React, { useCallback, useContext } from "react";
import app from "../base";
import { AuthContext } from "../Auth";
import { withRouter, Redirect } from "react-router";
import PropTypes from "prop-types";
import Header from "../components/header";

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  const signUpRedirect = () => {
    history.push("/signup");
  };

  return (
    <>
      <div className="backgroundHeader">
        <div className="formcard">
          <h1 id="skillshare">Skill Share</h1>
          <p id="loginsignup">
            <span id="bold">Log in </span>{" "}
            <span id="light"> &nbsp;or&nbsp; </span>
            <span id="bold">Sign Up</span>
          </p>
          <form onSubmit={handleLogin}>
            <div id="inputboxs">
              <input
                className="signUpInput"
                type="email"
                placeholder="Email:"
              ></input>
              <input
                className="signUpInput"
                type="password"
                placeholder="Password:"
              ></input>
            </div>

            <div className="buttons">
              <button className="loginButton" type="submit">
                Login
              </button>
              <button className="signUpButton" onClick={signUpRedirect}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

Login.propTypes = {
  history: PropTypes.node,
};

export default withRouter(Login);
