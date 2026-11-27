import { useMemo, useState } from "react";

const booksCatalog = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", available: true },
    { id: 2, title: "Design Patterns", author: "Erich Gamma", category: "Software Engineering", available: true },
    { id: 3, title: "Database System Concepts", author: "Abraham Silberschatz", category: "Databases", available: false },
    { id: 4, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming", available: true },
    { id: 5, title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Operating Systems", available: true },
];

export default function SearchAndFilters() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [availability, setAvailability] = useState("ALL");

    const categories = useMemo(
        () => ["ALL", ...new Set(booksCatalog.map((book) => book.category))],
        []
    );

    const filteredBooks = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return booksCatalog.filter((book) => {
            const matchesQuery =
                !query ||
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === "ALL" || book.category === selectedCategory;

            const matchesAvailability =
                availability === "ALL" ||
                (availability === "AVAILABLE" && book.available) ||
                (availability === "UNAVAILABLE" && !book.available);

            return matchesQuery && matchesCategory && matchesAvailability;
        });
    }, [searchQuery, selectedCategory, availability]);

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("ALL");
        setAvailability("ALL");
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.headerCard}>
                    <h1 style={styles.title}>Search & Filters</h1>
                    <p style={styles.subtitle}>Search by book title or author and filter by category or availability</p>
                </div>

                <div style={styles.card}>
                    <div style={styles.controlsGrid}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Search (Title or Author)</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter book title or author name..."
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={styles.select}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === "ALL" ? "All Categories" : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Availability</label>
                            <select
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                style={styles.select}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="UNAVAILABLE">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.toolbar}>
            <span style={styles.resultsCount}>
              Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
            </span>

                        {(searchQuery || selectedCategory !== "ALL" || availability !== "ALL") && (
                            <button type="button" onClick={handleResetFilters} style={styles.linkButton}>
                                Reset filters
                            </button>
                        )}
                    </div>

                    {filteredBooks.length === 0 ? (
                        <p style={styles.emptyText}>No books match your current search or filter criteria.</p>
                    ) : (
                        <div style={styles.resultsGrid}>
                            {filteredBooks.map((book) => (
                                <div key={book.id} style={styles.bookCard}>
                                    <div>
                                        <div style={styles.bookTitle}>{book.title}</div>
                                        <div style={styles.bookAuthor}>{book.author}</div>
                                        <div style={styles.bookCategory}>{book.category}</div>
                                    </div>

                                    <div style={styles.cardFooter}>
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: book.available ? "#16a34a" : "#dc2626",
                        }}
                    >
                      {book.available ? "Available" : "Unavailable"}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f6fb",
        padding: "36px 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: "#1f2937",
    },
    container: {
        maxWidth: "780px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    headerCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px 28px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
        textAlign: "center",
    },
    title: {
        margin: "0 0 6px 0",
        fontSize: "24px",
        fontWeight: 700,
        color: "#111827",
    },
    subtitle: {
        margin: 0,
        fontSize: "14px",
        color: "#6b7280",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px 28px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
    },
    controlsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "14px",
        marginBottom: "18px",
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#374151",
    },
    input: {
        padding: "9px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
    },
    select: {
        padding: "9px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        cursor: "pointer",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "14px",
        marginBottom: "16px",
        borderBottom: "1px solid #eef0f4",
    },
    resultsCount: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#6b7280",
    },
    linkButton: {
        background: "none",
        border: "none",
        color: "#6c63ff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        padding: 0,
    },
    emptyText: {
        margin: 0,
        fontSize: "14px",
        color: "#6b7280",
    },
    resultsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "14px",
    },
    bookCard: {
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "14px",
        backgroundColor: "#fafbff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "12px",
    },
    bookTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#111827",
    },
    bookAuthor: {
        fontSize: "13px",
        color: "#6b7280",
        marginTop: "2px",
    },
    bookCategory: {
        fontSize: "12px",
        color: "#9ca3af",
        marginTop: "4px",
    },
    cardFooter: {
        paddingTop: "8px",
        borderTop: "1px solid #eef0f4",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
    },
};