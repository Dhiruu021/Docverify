import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={styles.nav}>
      {/* LEFT — LOGO */}
      <div style={styles.left}>
        <img src={logo} alt="logo" style={styles.logo} />
        <h3 style={{ margin: 0 }}>DocVerify</h3>
      </div>

      {/* RIGHT — MENU */}
      <div style={styles.right} ref={dropRef}>
        <div style={styles.menuLinks}>
          {/* USER */}
          {role === "user" && (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/upload" style={styles.link}>Upload</Link>
              <Link to="/status" style={styles.link}>My Status</Link>
            </>
          )}

          {/* VERIFIER ADMIN */}
          {role === "verifieradmin" && (
            <>
              <Link to="/admin/pending" style={styles.link}>Verify</Link>
              <Link to="/admin/history" style={styles.link}>History</Link>
            </>
          )}

          {/* SUPER ADMIN */}
          {role === "superadmin" && (
            <>
              <Link to="/admin" style={styles.link}>Dashboard</Link>
              <Link to="/admin/pending" style={styles.link}>Verify</Link>
              <Link to="/admin/history" style={styles.link}>History</Link>
            </>
          )}
        </div>

        {/* ☰ MENU ICON */}
        <div style={styles.menuIcon} onClick={() => setOpen(!open)}>
          ☰
        </div>

        {/* DROPDOWN */}
        {open && (
          <div style={styles.dropdown}>
            <div
              style={styles.dropItem}
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              👤 Profile
            </div>
          <div
       style={styles.dropItem}
             onClick={() => {
              setOpen(false);
              navigate("/help");
             }}
>
             ❓ Help
          </div>
            <div style={styles.dropItem} onClick={logout}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    background: "#1f2933",
    color: "#fff",
    padding: "12px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
    fontSize: "18px",
  },
  logo: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    position: "relative",
  },
  menuLinks: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  menuIcon: {
    fontSize: "26px",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "48px",
    background: "#fff",
    color: "#000",
    borderRadius: "8px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
    width: "150px",
    overflow: "hidden",
    zIndex: 1000,
  },
  dropItem: {
    padding: "12px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
};

export default Navbar;
