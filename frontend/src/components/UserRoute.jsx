import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

function UserRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;

  // admin not allowed in user pages
  if (isAdmin()) return <Navigate to="/admin" replace />;

  return children;
}

export default UserRoute;
