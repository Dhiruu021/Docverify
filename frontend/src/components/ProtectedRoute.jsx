import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role missing (corrupted storage)
  if (!userRole) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Access granted
  return children;
};

export default ProtectedRoute;
