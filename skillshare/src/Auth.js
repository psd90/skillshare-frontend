import React, { useEffect, useState } from "react";
import app from "./base";
import PropTypes from "prop-types";
import Loader from "./components/Loader";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("no user");

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return currentUser !== "no user" ? (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  ) : (
    <Loader />
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
