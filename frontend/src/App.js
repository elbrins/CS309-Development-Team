
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="app">
      {page === "login" ? (
        <Login onSwitch={() => setPage("register")} />
      ) : (
        <Register onSwitch={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;
