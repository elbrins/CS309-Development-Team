import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "library_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      
    }
  }, [user]);

  const login = (userData) => {
    setUser({
      name: userData.name || "Library Member",
      email: userData.email || "",
      role: (userData.role || "student").toLowerCase(),
      token: userData.token || null,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRoleDemo = (role) => {
    const lowerRole = role.toLowerCase();
    setUser((prev) => ({
      name: prev?.name || "Demo User",
      email: prev?.email || "demo@library.edu",
      token: prev?.token || null,
      role: lowerRole,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        login,
        logout,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}