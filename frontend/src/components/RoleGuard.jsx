import { useAuth } from "../context/AuthContext";

function RoleGuard({ allowedRoles = [], children, fallback = null }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !role) {
    return fallback;
  }

  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
  if (!normalizedAllowed.includes(role.toLowerCase())) {
    return fallback;
  }

  return children;
}

export default RoleGuard;