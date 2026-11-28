import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import RoleGuard from "../components/RoleGuard";
import DeleteBookModal from "../components/DeleteBookModal";

const INITIAL_FEATURED_BOOKS = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Software Engineering",
    availableCopies: 4,
    featured: true,
  },
  {
    id: 2,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    availableCopies: 2,
    featured: true,
  },
  {
    id: 3,
    title: "Computer Networking: A Top-Down Approach",
    author: "James F. Kurose",
    category: "Networks",
    availableCopies: 0,
    featured: true,
  },
  {
    id: 4,
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    category: "AI",
    availableCopies: 5,
    featured: true,
  },
];

function HomePage({ onNavigate }) {
  const { user, role, logout, switchRoleDemo } = useAuth();
  const [books, setBooks] = useState(INITIAL_FEATURED_BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  const handleConfirmDelete = async (book) => {
    setBooks((prev) => prev.filter((item) => item.id !== book.id));
    setBookToDelete(null);
    setStatusMessage(`"${book.title}" has been deleted.`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="lib-container">
   
      <header className="lib-navbar">
        <div className="lib-brand" onClick={() => onNavigate?.("home")}>
          Library Hub
        </div>

        <nav className="lib-nav-links">
          <button
            type="button"
            className="lib-link-btn active"
            onClick={() => onNavigate?.("home")}
          >
            Home
          </button>
          <button
            type="button"
            className="lib-link-btn"
            onClick={() => onNavigate?.("catalog")}
          >
            Catalog
          </button>
          <button
            type="button"
            className="lib-link-btn"
            onClick={() => onNavigate?.("profile")}
          >
            Profile
          </button>

          <RoleGuard allowedRoles={["librarian", "admin"]}>
            <button
              type="button"
              className="lib-link-btn"
              onClick={() => onNavigate?.("librarian")}
            >
              Librarian Panel
            </button>
          </RoleGuard>

          {user ? (
            <button type="button" className="lib-btn-outline" onClick={logout}>
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="lib-btn-primary"
              onClick={() => onNavigate?.("login")}
            >
              Login
            </button>
          )}
        </nav>
      </header>

    
      <section className="lib-card hero-section">
        <div className="hero-badge">
          {user ? `Logged in as: ${user.name} (${role})` : "Guest Visitor"}
        </div>
        <h1>Welcome to the Smart Library System</h1>
        <p className="subtitle">
          Discover featured books, search by title or author, and manage your library
          activity in one place.
        </p>

        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search featured books by title, author, or category..."
          />
          {searchQuery && (
            <button
              type="button"
              className="lib-btn-outline"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          )}
        </div>

       
        <div className="demo-role-bar">
          <span>Test Role:</span>
          {["student", "librarian", "admin"].map((r) => (
            <button
              key={r}
              type="button"
              className={`role-pill ${role === r ? "active" : ""}`}
              onClick={() => switchRoleDemo(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      {statusMessage && <div className="lib-alert-success">{statusMessage}</div>}

     
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <span className="count-tag">{filteredBooks.length} books</span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="lib-card empty-state">
            <p>No books matched your search.</p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => {
              const isAvailable = book.availableCopies > 0;
              return (
                <div key={book.id} className="lib-card book-card">
                  <div className="book-top">
                    <span className="book-category">{book.category}</span>
                    <span
                      className={`availability-badge ${
                        isAvailable ? "available" : "unavailable"
                      }`}
                    >
                      {isAvailable
                        ? `${book.availableCopies} Available`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>

                  <div className="book-actions">
                    <button
                      type="button"
                      className="lib-btn-primary"
                      onClick={() => onNavigate?.("details")}
                    >
                      View Details
                    </button>

                    <RoleGuard allowedRoles={["librarian", "admin"]}>
                      <button
                        type="button"
                        className="lib-btn-danger"
                        onClick={() => setBookToDelete(book)}
                      >
                        Delete
                      </button>
                    </RoleGuard>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

     
      <DeleteBookModal
        book={bookToDelete}
        onCancel={() => setBookToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default HomePage;