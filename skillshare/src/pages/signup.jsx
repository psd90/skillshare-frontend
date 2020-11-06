import React, { useCallback, useState } from "react";
import { withRouter } from "react-router";
import app from "../base";
import PropTypes from "prop-types";
import axios from "axios";

// hooks read up
const SignUp = ({ history }) => {
  const [passUsername, setPassUsername] = useState("");
  const [classUsername, setClassUsername] = useState("");
  const [username, setUsername] = useState("");

  const [passEmail, setPassEmail] = useState("");
  const [classEmail, setClassEmail] = useState("");
  const [emailTwo, setEmail] = useState("");

  const [passPassword, setPassPassword] = useState("");
  const [classPassword, setClassPassword] = useState("");

  const [passDate, setPassDate] = useState("");
  const [classDate, setClassDate] = useState("");
  const [date, setDate] = useState("");

  const [passSubmit, setPassSubmit] = useState(true);

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then((auth) => {
            axios
              .put(
                `https://firebasing-testing.firebaseio.com/users/${auth.user.uid}.json`,
                { username: username, email: emailTwo, date: date }
              )
              .then(() => {
                axios.patch(
                  `https://firebasing-testing.firebaseio.com/usernames.json`,
                  { [username]: true }
                );
              });
          });
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history, username, date, emailTwo]
  );

  const redirectLogin = () => {
    history.push("/login");
  };

  const usernameChange = (event) => {
    const usernameChange = event.target.value;
    // return app
    //   .database()
    //   .ref()
    //   .child("users")
    //   .once("value")
    //   .then((snap) => {
    //     console.log(snap.val());
    //   });
    const regex = /^[0-9A-Za-z\-]+$/g;
    const isValid = regex.test(usernameChange);
    if (!isValid) {
      setClassUsername("bad");
      setPassUsername("invalid");
    } else {
      setClassUsername("good");
      setUsername(usernameChange);
      setPassUsername("valid");
    }
    if (
      passUsername !== "valid" ||
      passEmail !== "valid" ||
      passPassword !== "valid" ||
      passDate !== "valid"
    ) {
      setPassSubmit(true);
    } else {
      console.log("passed");
      setPassSubmit(false);
    }
  };

  const emailChange = (event) => {
    const email = event.target.value;
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = regex.test(email);
    if (!isValid) {
      setClassEmail("bad");
      setPassEmail("invalid");
    } else {
      setClassEmail("good");
      setPassEmail("valid");
      setEmail(email);
    }
    if (
      passUsername !== "valid" ||
      passEmail !== "valid" ||
      passPassword !== "valid" ||
      passDate !== "valid"
    ) {
      setPassSubmit(true);
    } else {
      console.log("passed");
      setPassSubmit(false);
    }
  };

  const passwordChange = (event) => {
    const password = event.target.value;
    const regex = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/;
    const isValid = regex.test(password);
    if (!isValid) {
      setClassPassword("bad");
      setPassPassword(
        "must contain at least 1 number and letter and be at least 6 characters long"
      );
    } else {
      setClassPassword("good");

      setPassPassword("valid");
    }
    if (
      passUsername !== "valid" ||
      passEmail !== "valid" ||
      passPassword !== "valid" ||
      passDate !== "valid"
    ) {
      setPassSubmit(true);
    } else {
      console.log("passed");
      setPassSubmit(false);
    }
  };

  const dateChange = (event) => {
    const value = event.target.value;
    console.log(event.target.value);
    const inputDate = Date.parse(value);
    const dateNow = Date.now();
    const difference = dateNow - inputDate;
    if (difference < 568025136000) {
      setClassDate("bad");
      setPassDate("must be over 18");
    } else {
      setClassDate("good");
      setPassDate("valid");
      setDate(inputDate);
    }
    if (
      passUsername !== "valid" ||
      passEmail !== "valid" ||
      passPassword !== "valid" ||
      passDate !== "valid"
    ) {
      setPassSubmit(true);
    } else {
      console.log("passed");
      setPassSubmit(false);
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
            <p className={classUsername}>{passUsername}</p>
            <input
              onChange={emailChange}
              className="signUpInput"
              name="email"
              type="call"
              placeholder="Email"
            />
            <p className={classEmail}>{passEmail}</p>
            <input
              onChange={passwordChange}
              className="signUpInput"
              name="password"
              type="password"
              placeholder="Password"
            />
            <p className={classPassword}>{passPassword}</p>
            Date of Birth
            <input
              onChange={dateChange}
              className="signUpInput"
              name="date"
              type="date"
              id="date"
            />
            <p className={classDate}>{passDate}</p>
            <div className="buttonGroup">
              <button
                disabled={passSubmit}
                className="signUpButton"
                type="submit"
              >
                Sign Up
              </button>
              <button className="signUpButton" onClick={redirectLogin}>
                Back
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
