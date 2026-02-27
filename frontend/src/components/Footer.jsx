import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const role = localStorage.getItem("role");

  const isAdmin = role === "superadmin" || role === "verifieradmin";

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <h3>DocVerify</h3>
            <p>Secure & Smart Document Verification System powered by AI technology.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-sections">
            {isAdmin ? (
              <>
                <div className="footer-section">
                  <h4>Admin Panel</h4>
                  <a href="/admin">Dashboard</a>
                  <a href="/admin/pending">Verify Documents</a>
                  <a href="/admin/history">Verification History</a>
                  {role === "superadmin" && <a href="/admin/users">User Management</a>}
                </div>

                <div className="footer-section">
                  <h4>Quick Links</h4>
                  <a href="/profile">My Profile</a>
                  <a href="/help">Help Center</a>
                  <a href="/help">Contact Support</a>
                </div>

                <div className="footer-section">
                  <h4>Legal</h4>
                  <a href="/help">Privacy Policy</a>
                  <a href="/help">Terms of Service</a>
                  <a href="/help">Cookie Policy</a>
                </div>
              </>
            ) : (
              <>
                <div className="footer-section">
                  <h4>My Account</h4>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/upload">Upload Document</a>
                  <a href="/status">My Documents</a>
                  <a href="/profile">Profile</a>
                </div>

                <div className="footer-section">
                  <h4>Support</h4>
                  <a href="/help">Help Center</a>
                  <a href="/help">Contact Us</a>
                  <a href="/help">FAQs</a>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} DocVerify. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/help">Privacy</a>
            <a href="/help">Terms</a>
            <a href="/help">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
