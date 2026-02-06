import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";

// USER
import UserDashboard from "./pages/UserDashboard";
import Upload from "./pages/Upload";
import MyStatus from "./pages/MyStatus";
import Profile from "./pages/Profile";

// ADMIN / VERIFIER
import AdminMainDashboard from "./pages/AdminMainDashboard";
import AdminPending from "./pages/AdminPending";
import AdminHistory from "./pages/AdminHistory";

// 🔥 HELP PAGE
import Help from "./pages/Help";

// ROUTE GUARD
import ProtectedRoute from "./components/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

function AppWrapper() {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  /* 🚫 Disable browser back button AFTER login */
  useEffect(() => {
    if (loggedIn) {
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [loggedIn]);

  return (
    <>
      {/* ✅ Navbar only after login & not on auth pages */}
      {loggedIn &&
        location.pathname !== "/" &&
        location.pathname !== "/register" && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/status"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "verifieradmin", "superadmin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= HELP (ALL LOGGED-IN ROLES) ================= */}
        <Route
          path="/help"
          element={
            <ProtectedRoute allowedRoles={["user", "verifieradmin", "superadmin"]}>
              <Help />
            </ProtectedRoute>
          }
        />

        {/* ================= VERIFIER + SUPER ADMIN ================= */}
        <Route
          path="/admin/pending"
          element={
            <ProtectedRoute allowedRoles={["verifieradmin", "superadmin"]}>
              <AdminPending />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/history"
          element={
            <ProtectedRoute allowedRoles={["verifieradmin", "superadmin"]}>
              <AdminHistory />
            </ProtectedRoute>
          }
        />

        {/* ================= SUPER ADMIN ONLY ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminMainDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK (VERY IMPORTANT) ================= */}
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
