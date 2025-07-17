/* eslint-disable react/prop-types */
import { isAdmin } from "./auth";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
