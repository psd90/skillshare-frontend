import React, { useCallback, useContext, useState } from "react";
import app from "../base";
import { AuthContext } from "../Auth";
import { withRouter, Redirect } from "react-router";
import PropTypes from "prop-types";

const Login = ({ history }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await app.auth().signInWithEmailAndPassword(email, password);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history, password, email]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  const signUpRedirect = () => {
    history.push("/signup");
  };

  const enteredPassword = (event) => {
    setPassword(event.target.value);
  };

  const enteredEmail = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <div className="backgroundHeader">
        <div className="formcard">
          <h1 id="skillshare">SkllShr</h1>
          <p id="loginsignup">
            <span id="bold">Log in </span>{" "}
            <span id="light"> &nbsp;or&nbsp; </span>
            <span id="bold">Sign Up</span>
          </p>
          <form onSubmit={handleLogin}>
            <div id="inputboxs">
              <input
                onChange={enteredEmail}
                className="signUpInput"
                type="email"
                placeholder="Email:"
              ></input>

              <input
                onChange={enteredPassword}
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
