import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Profile from "./profile";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  // Small demo bar to jump between the three pages
  const nav = (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        display: "flex",
        gap: 8,
        zIndex: 10,
      }}
    >
      {["login", "register", "profile"].map((p) => (
        <button
          key={p}
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

  if (page === "profile") {
    return (
      <>
        {nav}
        <Profile />
      </>
    );
  }

  return (
    <>
      {nav}
      <div className="app">
        {page === "login" ? (
          <Login onSwitch={() => setPage("register")} />
        ) : (
          <Register onSwitch={() => setPage("login")} />
        )}
      </div>
    </>
  );
}

export default App;
