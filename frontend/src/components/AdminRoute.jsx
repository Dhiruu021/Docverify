import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

function AdminRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;

  return children;
}

export default AdminRoute;
