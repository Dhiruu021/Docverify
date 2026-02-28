import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      if (res.data.role === "superadmin") {
        navigate("/admin");
      } else if (res.data.role === "verifieradmin") {
        navigate("/admin/pending");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email: forgotEmail });
      setForgotMessage(res.data.message);
      setForgotEmail("");
    } catch (err) {
      setForgotMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-hero">
          <div className="hero-content">
            <h1>DocVerify</h1>
            <p>Secure & Smart Document Verification System powered by AI technology</p>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>AI-Powered Verification</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Secure Document Storage</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Instant Status Updates</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <span className="mobile-brand">DocVerify</span>
              <p>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>📧 Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>🔒 Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Contact your administrator for account access</p>
            </div>

            <div className="forgot-password-section">
              <button 
                className="forgot-link" 
                onClick={() => setShowForgot(!showForgot)}
              >
                {showForgot ? "← Back to Login" : "Forgot Password?"}
              </button>

              {showForgot && (
                <form onSubmit={handleForgotSubmit} className="forgot-form">
                  <div className="form-group">
                    <label>📧 Enter your email</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={forgotLoading}>
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  {forgotMessage && <p className="forgot-message">{forgotMessage}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
