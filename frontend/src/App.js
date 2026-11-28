import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Login from "./Login";
import Register from "./Register";
import Profile from "./profile";
import "./App.css";

function AppContent() {
  const [page, setPage] = useState("home");

  const nav = (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        display: "flex",
        gap: 8,
        zIndex: 20,
        flexWrap: "wrap",
      }}
    >
      {["home", "login", "register", "profile", "librarian"].map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #6366f1",
            background: page === p ? "#6366f1" : "#fff",
            color: page === p ? "#fff" : "#6366f1",
            fontWeight: "bold",
            cursor: "pointer",
            textTransform: "capitalize",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );

  if (page === "home") {
    return (
      <>
        {nav}
        <HomePage onNavigate={(target) => setPage(target)} />
      </>
    );
  }

  if (page === "profile") {
    return (
      <>
        {nav}
        <Profile />
      </>
    );
  }

  if (page === "librarian") {
    return (
      <>
        {nav}
        <ProtectedRoute
          allowedRoles={["librarian", "admin"]}
          onBackHome={() => setPage("home")}
        >
          <div className="lib-container">
            <div className="lib-card">
              <h1>Librarian Management</h1>
              <p className="subtitle">
                Authorized view for librarians and admins to manage books and loans.
              </p>
              <button
                type="button"
                className="lib-btn-primary"
                onClick={() => setPage("home")}
              >
                Back to Home Page
              </button>
            </div>
          </div>
        </ProtectedRoute>
      </>
    );
  }

  return (
    <>
      {nav}
      <div className="app">
   {page === "login" ? (
          <Login
            onSwitch={() => setPage("register")}
            onLoginSuccess={() => setPage("home")}
          />
        ) : (
          <Register onSwitch={() => setPage("login")} />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;