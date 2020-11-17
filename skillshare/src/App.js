import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import CreateProfile from "./pages/create-profile";
import Home from "./pages/home";
import Messages from "./pages/messages";
import Profile from "./pages/profile";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import EditProfile from "./pages/edit-profile";

function App() {
  return (
    <>
      <div className="App" id="content" role="main">
        <AuthProvider>
          <Router>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute
              exact
              path="/:username/messages"
              component={Messages}
            />
            <PrivateRoute
              exact
              path="/createprofile"
              component={CreateProfile}
            />
            <PrivateRoute exact path="/profile/:username" component={Profile} />
            <PrivateRoute exact path="/editprofile" component={EditProfile} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
          </Router>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
