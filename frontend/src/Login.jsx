
function Login({ onSwitch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login form submitted!");
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
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      <p className="switch-text">
        Don't have an account?
        <span onClick={onSwitch}> Register</span>
      </p>
    </div>
  );
}

export default Login;
