import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import CreateProfile from "./pages/create-profile";
import Home from "./pages/home";
import Messages from "./pages/messages";
import Review from "./pages/review";
import Profile from "./pages/profile";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import Header from "./components/header";

function App() {
  return (
    <>
      <Header />
      <div className="App" id="content" role="main">
        <div className="buffer"></div>

        <AuthProvider>
          <Router>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
          </Router>
        </AuthProvider>
        <Router>
          <Route exact path="/createprofile" component={CreateProfile} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/:username/messages" component={Messages} />
          <Route exact path="/:username/review" component={Review} />
          <Route exact path="/profile/:username" component={Profile} />
        </Router>
      </div>
    </>
  );
}

export default App;
