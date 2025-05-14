import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authToken, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; 

  return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
