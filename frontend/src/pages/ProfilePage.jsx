import { useEffect, useState } from "react";

const DEFAULT_USER = {
  name: "Student User",
  email: "student@library.edu",
  role: "Student",
};

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("library_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("library_user", JSON.stringify(user));
  }, [user]);

  function handleSave(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMessage("Please enter both name and email.");
      return;
    }

    const updated = { ...user, name: name.trim(), email: email.trim() };
    setUser(updated);
    setMessage("Profile updated successfully.");
  }

  return (
    <div>
      <h2>My Profile</h2>
      <p>Role: {user.role}</p>

      <form onSubmit={handleSave}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit">Save</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}