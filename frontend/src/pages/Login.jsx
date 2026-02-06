import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔥 SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

   // 🔥 ROLE BASED REDIRECT (FIXED)
   if (res.data.role === "superadmin") {
   navigate("/admin");
   } else if (res.data.role === "verifieradmin") {
   navigate("/admin/pending"); 
   } else {
   navigate("/dashboard");
   }


    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password with emoji toggle */}
          <div className="password-wrapper">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="eye-icon"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "👁️" : "🙈"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Create new account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
