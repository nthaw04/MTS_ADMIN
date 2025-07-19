/* eslint-disable react/prop-types */
import { isAdmin } from "./auth";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  return isAdmin() ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
