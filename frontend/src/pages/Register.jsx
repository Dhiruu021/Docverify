import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Register.css";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
  const [showPass, setShowPass] = useState(false); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Selected role:", role);
    try {
     await API.post("/auth/register", { name, email, password, role, phone });

      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
  placeholder="Phone Number"
  onChange={(e) => setPhone(e.target.value)}
/>


          {/*Password with Show/Hide */}
          <div className="password-wrapper">
  <input
    type={showPass ? "text" : "password"}
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <span
    className="eye-icon"
    onClick={() => setShowPass(!showPass)}
  >
    {showPass ? "👁️" : "🙈"}
  </span>
</div>


          {/*Role Dropdown */}
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="user">User</option>
            <option value="verifieradmin">verifier Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
