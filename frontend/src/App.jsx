import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// AUTH
import Login from "./pages/Login";

// USER
import UserDashboard from "./pages/UserDashboard";
import Upload from "./pages/Upload";
import MyStatus from "./pages/MyStatus";
import Profile from "./pages/Profile";
import LeaveRequest from "./pages/LeaveRequest";
import Notices from "./pages/Notices";
import Messages from "./pages/Messages";

// ADMIN / VERIFIER
import AdminMainDashboard from "./pages/AdminMainDashboard";
import AdminVerifier from "./pages/AdminVerifier";
import AdminHistory from "./pages/AdminHistory";
import UserManagement from "./pages/UserManagement";
import AdminLeaveManagement from "./pages/AdminLeaveManagement";

// HELP PAGE
import Help from "./pages/Help";

// ROUTE GUARD
import ProtectedRoute from "./components/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

function AppWrapper() {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  /* Disable browser back button AFTER login */
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

  const hideLayout = location.pathname === "/";

  return (
    <>
      {/* Navbar */}
      {loggedIn && !hideLayout && <Navbar />}

      {/* ROUTES */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* USER */}
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
            <ProtectedRoute
              allowedRoles={["user", "verifieradmin", "superadmin"]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <LeaveRequest />
            </ProtectedRoute>
          }
        />

        {/* NOTICES */}
        <Route
          path="/notices"
          element={
            <ProtectedRoute
              allowedRoles={["user", "verifieradmin", "superadmin"]}
            >
              <Notices />
            </ProtectedRoute>
          }
        />

        {/* MESSAGES */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute
              allowedRoles={["user", "verifieradmin", "superadmin"]}
            >
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* HELP */}
        <Route
          path="/help"
          element={
            <ProtectedRoute
              allowedRoles={["user", "verifieradmin", "superadmin"]}
            >
              <Help />
            </ProtectedRoute>
          }
        />

        {/* VERIFIER + SUPERADMIN */}
        <Route
          path="/admin/pending"
          element={
            <ProtectedRoute allowedRoles={["verifieradmin", "superadmin"]}>
              <AdminVerifier />
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

        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute allowedRoles={["verifieradmin", "superadmin"]}>
              <AdminLeaveManagement />
            </ProtectedRoute>
          }
        />

        {/* SUPER ADMIN ONLY */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminMainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/dashboard" : "/"} replace />}
        />
      </Routes>

      {/* Footer */}
      {loggedIn && !hideLayout && <Footer />}
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
