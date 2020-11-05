import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "../base";
import PropTypes from "prop-types";

// usernameInput.addEventListener("change", (event) => {
//   console.dir(event.target.value);
//   const value = event.target.value;
//   const name = event.target.name;
//   const regex = /^[A-Za-z\-]+$/g;
//   const isValid = regex.test(value);
//   if (!isValid) {
//     const warningText = document.createElement("p");
//     warningText.classList.add("warning-text");
//     warningText.textContent = "Username must contain characters a-z or '-'";
//     const container = document.querySelector(`#${name}-container`);
//     container.appendChild(warningText);
//   } else {
//     event.target.classList.add("valid");
//   }
// });

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

  let passUsername = "i am a string";

  const usernameChange = (event) => {
    const username = event.target.value;
    const regex = /^[0-9A-Za-z\-]+$/g;
    const isValid = regex.test(username);
    if (!isValid) {
      passUsername = false;
    } else {
      passUsername = true;
    }
  };

  return (
    <>
      <h1 className="signUpHeading">Sign Up</h1>
      <div className="formcard">
        <div className="innerForm">
          <form className="signUpForm" id="form" onSubmit={handleSignUp}>
            <input
              onChange={usernameChange}
              className="signUpInput"
              name="username"
              id="username"
              type="text"
              placeholder="Username"
            />
            <passUsername />
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

// const formElements = document.getElementById("form");
// console.log(formElements);
// let usernamePass = false;
// let emailPass = false;
// let passwordPass = false;
// let datePass = false;

// // for (let i = 0; i < formElements.length; i++) {
// //   const obj = {
// //     username: "change",
// //     email: "change",
// //     password: "keyup",
// //     date: "change",
// //     submit: "click",
// //   };
// //   const eventToUse = obj[formElements[i].name];
// //   formElements[i].addEventListener(eventToUse, (event) => {
// //     const value = event.target.value;
// //     const name = event.target.name;
// //   });
// // }
