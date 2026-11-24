
function Register({ onSwitch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration form submitted!");
  };

  return (
    <div className="auth-card">
      <h1>Create Account</h1>
      <p className="subtitle">Create your account to get started</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>

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
            placeholder="Create a password"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Create Account
        </button>
      </form>

      <p className="switch-text">
        Already have an account?
        <span onClick={onSwitch}> Login</span>
      </p>
    </div>
  );
}

export default Register;
