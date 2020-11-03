import './App.css';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './pages/login'
import Signup from './pages/signup'
import CreateProfile from './pages/create-profile'
import Home from './pages/home'
import Header from './components/header'
import Messages from './pages/messages'
import Review from './pages/review'
import Profile from './pages/profile'

function App() {
  return (
    <div className="App">
      <Header />
      <div className='buffer'></div>
      <Router>
        <Switch>
          <Route path="/signup">
            <Signup/>
          </Route>
          <Route path="/createprofile">
            <CreateProfile/>
          </Route>
          <Route path="/home">
            <Home/>
          </Route>
          <Route path="/:username/messages">
            <Messages/>
          </Route>
          <Route path="/:username/review">
            <Review/>
          </Route>
          <Route path="/:username" component={Profile} hello='hello'/>
          <Route path="/">
            <Login/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
