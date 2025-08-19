// src/components/PrivateRoute.jsx
import React from "react";

const PrivateRoute = ({ children }) => {
  // Since auth is removed, always render children
  return children;
};

export default PrivateRoute;
