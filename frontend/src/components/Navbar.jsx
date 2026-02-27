import logo from "../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        if (res.data.profileImage) {
          setProfileImage(res.data.profileImage);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    switch (role) {
      case "user":
        return [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/upload", label: "Upload" },
          { path: "/status", label: "My Status" },
          { path: "/leaves", label: "Leaves" },
        ];
      case "verifieradmin":
        return [
          { path: "/admin/pending", label: "Verify" },
          { path: "/admin/history", label: "History" },
          { path: "/admin/leaves", label: "Leaves" },
        ];
      case "superadmin":
        return [
          { path: "/admin", label: "Dashboard" },
          { path: "/admin/pending", label: "Verify" },
          { path: "/admin/history", label: "History" },
          { path: "/admin/leaves", label: "Leaves" },
          { path: "/admin/users", label: "Users" },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logo} alt="DocVerify" className="navbar-logo" />
          <span className="navbar-title">DocVerify</span>
        </div>

        <div className="navbar-nav" ref={dropRef}>
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="nav-actions">
              <div className="user-menu">
                <button
                  className="user-avatar-btn"
                  onClick={() => setOpen(!open)}
                >
                  <div className="user-avatar-circle">
                    {profileImage ? (
                      <img src={`${profileImage}`} alt="Profile" className="avatar-img" />
                    ) : (
                      role?.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>

              {open && (
                <div className="dropdown-menu">

                  <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Profile
                  </Link>
                  <Link to="/notices" className="dropdown-item" onClick={() => setOpen(false)}>
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    Notices
                  </Link>
                  <Link to="/messages" className="dropdown-item" onClick={() => setOpen(false)}>
                    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                    Messages
                  </Link>
                  <Link to="/help" className="dropdown-item" onClick={() => setOpen(false)}>
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                    Help
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={logout}>
                    <svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    Logout
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
