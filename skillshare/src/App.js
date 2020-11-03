import './App.css';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './pages/login'

function App() {
  return (
    <div className="App">
      <h1>in app.js</h1>
      <Router>
        <Switch>
          <Route path="/">
            <Login/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
