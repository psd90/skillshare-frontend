import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Login extends React.Component{


    render(){
        return(<>
            <p id='loginsignup'><span id='bold'>Log in </span> <span id='light'> &nbsp;or&nbsp; </span><span id='bold'>Sign Up</span></p>
            <form className='loginform'>

                <div id='inputboxs'>
                <input className='inputbox' type='email' placeholder='Email:'></input>
                <input className='inputbox' type='password' placeholder='password:'></input>
            </div>

                <div className='buttons'>
                <button className='singlebutton'>Login</button>
                <button className='singlebutton'>Sign Up</button>
                </div>
                    
            </form>
            </>
        )
    }
}

export default Login