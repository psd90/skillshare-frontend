import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "../base";
import PropTypes from "prop-types";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const redirectLogin = () => {
    history.push("/login");
  };

  return (
    <>
      <h1 className="signUpHeading">Sign Up</h1>
      <div className="formcard">
        <div className="innerForm">
          <form className="signUpForm" onSubmit={handleSignUp}>
            <input
              className="signUpInput"
              name="username"
              type="text"
              placeholder="Username"
            />
            <input
              className="signUpInput"
              name="email"
              type="call"
              placeholder="Email"
            />
            <input
              className="signUpInput"
              name="password"
              type="password"
              placeholder="Password"
            />
            Date of Birth
            <input className="signUpInput" name="date" type="date" id="date" />
            <div className="buttonGroup">
              <button className="signUpButton" type="submit">
                Sign Up
              </button>
              <button className="signUpButton" onClick={redirectLogin}>
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

SignUp.propTypes = {
  history: PropTypes.node,
};

export default withRouter(SignUp);
