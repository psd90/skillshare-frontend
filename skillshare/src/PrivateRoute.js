import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import PropTypes from 'prop-types'




const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !currentUser ? (
          <Redirect to={"/login"} />
        ) : (
          <RouteComponent {...routeProps} />
        )
      }
    ></Route>
  );

  
};

PrivateRoute.propTypes = {
  component: PropTypes.node,
}

export default PrivateRoute;
