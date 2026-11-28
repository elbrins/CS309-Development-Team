import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles = [], onBackHome, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="lib-container">
        <div className="lib-card guard-box">
          <h2>Login Required</h2>
          <p className="subtitle">
            Please log in first to access this section of the library system.
          </p>
          {onBackHome && (
            <button type="button" className="lib-btn-primary" onClick={onBackHome}>
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(role?.toLowerCase())
  ) {
    return (
      <div className="lib-container">
        <div className="lib-card guard-box">
          <h2>Access Denied</h2>
          <p className="subtitle">
            Your current role (<strong>{role}</strong>) does not have permission to view this page.
          </p>
          {onBackHome && (
            <button type="button" className="lib-btn-primary" onClick={onBackHome}>
              Go to Home Page
            </button>
          )}
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;