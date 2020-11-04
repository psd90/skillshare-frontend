import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "../base";
import PropTypes from 'prop-types'
import Header from '../components/header'



const SignUp = ({history}) => {

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
    
      return (<>
        <Header />
        <div className='formcard'>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <label>
              Email
              <input name="email" type="call" placeholder="email" />
            </label>
            <label>
              Password
              <input name="password" type="password" placeholder="Password" />
            </label>
            <button type="submit">Sign Up</button>
          </form>
          <button onClick={redirectLogin}>Log in</button>
        </div>
        </>
      );
    };
    
    SignUp.propTypes = {
      history: PropTypes.node,
  }

    export default withRouter(SignUp);
    