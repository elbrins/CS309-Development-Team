import { useState } from "react";
import { useAuth } from "./context/AuthContext";

function Login({ onSwitch, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const lowerEmail = email.toLowerCase();
    let detectedRole = "student";
    if (lowerEmail.includes("admin")) {
      detectedRole = "admin";
    } else if (lowerEmail.includes("librarian")) {
      detectedRole = "librarian";
    }

    const derivedName = email.split("@")[0] || "Library User";

    login({
      name: derivedName,
      email,
      role: detectedRole,
    });

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="auth-card">
      <h1>Welcome Back!</h1>
      <p className="subtitle">Please login to your account</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      <p className="switch-text">
        Don&apos;t have an account?
        <span onClick={onSwitch}> Register</span>
      </p>
    </div>
  );
}

export default Login;