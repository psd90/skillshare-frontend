import './App.css';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './pages/login'
import SignUp from './pages/signup'
import CreateProfile from './pages/create-profile'
import Home from './pages/home'
import Header from './components/header'
import Messages from './pages/messages'
import Review from './pages/review'
import Profile from './pages/profile'
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";


function App() {
  return (
    <div className="App">
      <Header />
      <div className='buffer'></div>

      <AuthProvider>
      <Router>
        <PrivateRoute exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
      </Router>
    </AuthProvider>


      <Router>
        <Switch>
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
          <Route path="/:username">
            <Profile/>
          </Route>
      
        </Switch>
      </Router>
    </div>
  );
}


export default App;
